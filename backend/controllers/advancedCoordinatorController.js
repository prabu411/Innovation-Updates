const Event = require('../models/Event');
const Application = require('../models/Application');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
  try {
    // Execute all independent queries in parallel for faster response time
    const [
      totalEvents,
      activeEvents,
      completedEvents,
      totalApplications,
      pendingApprovals,
      approvedApplications,
      uniqueParticipants,
      yearWiseData,
      departmentWiseData
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: 'active' }),
      Event.countDocuments({ status: 'completed' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.distinct('student'),
      User.aggregate([{ $match: { role: 'student' } }, { $group: { _id: '$year', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      User.aggregate([{ $match: { role: 'student' } }, { $group: { _id: '$department', count: { $sum: 1 } } }])
    ]);
    
    const totalParticipants = uniqueParticipants.length;

    res.json({
      totalEvents,
      activeEvents,
      completedEvents,
      totalApplications,
      pendingApprovals,
      approvedApplications,
      totalParticipants,
      yearWiseData,
      departmentWiseData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bulkApproveApplications = async (req, res) => {
  try {
    const { applicationIds } = req.body;
    await Application.updateMany(
      { _id: { $in: applicationIds } },
      { status: 'approved' }
    );
    
    // Fetch all affected applications in one query to get details for notifications
    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate('student hackathon');

    // Prepare notifications array for bulk insertion
    const notifications = applications.map(app => ({
      recipient: app.student._id,
      type: 'approval',
      title: 'Application Approved',
      message: `Your application for ${app.hackathon.name} has been approved`,
      priority: 'high'
    }));
    
    if (notifications.length > 0) await Notification.insertMany(notifications);

    res.json({ message: 'Applications approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const { studentId, eventId, type, position } = req.body;
    
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();
    
    const certificate = await Certificate.create({
      student: studentId,
      event: eventId,
      certificateNumber,
      type,
      position,
      verificationCode
    });
    
    await Notification.create({
      recipient: studentId,
      type: 'certificate',
      title: 'Certificate Generated',
      message: 'Your participation certificate is ready for download',
      link: `/certificates/${certificate._id}`,
      priority: 'high'
    });
    
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendBulkNotification = async (req, res) => {
  try {
    const { recipients, title, message, type, priority } = req.body;
    
    const notifications = recipients.map(recipientId => ({
      recipient: recipientId,
      type,
      title,
      message,
      priority
    }));
    
    await Notification.insertMany(notifications);
    res.json({ message: `Notification sent to ${recipients.length} students` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const mongoose = require('mongoose');
    
    // Use Promise.all to fetch event details and run aggregation simultaneously
    const [event, stats] = await Promise.all([
      Event.findById(eventId).populate('participants'),
      Application.aggregate([
        { $match: { hackathon: new mongoose.Types.ObjectId(eventId) } },
        {
          $lookup: {
            from: 'users', // Assumes your User collection is named 'users'
            localField: 'student',
            foreignField: '_id',
            as: 'studentDetails'
          }
        },
        { $unwind: '$studentDetails' },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            approvedCount: [{ $match: { status: 'approved' } }, { $count: 'count' }],
            yearWise: [{ $group: { _id: '$studentDetails.year', count: { $sum: 1 } } }],
            sectionWise: [{ $group: { _id: '$studentDetails.section', count: { $sum: 1 } } }]
          }
        }
      ])
    ]);

    const result = stats[0];

    res.json({
      event,
      totalApplications: result.totalCount[0]?.count || 0,
      approvedCount: result.approvedCount[0]?.count || 0,
      yearWise: result.yearWise.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      sectionWise: result.sectionWise.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
