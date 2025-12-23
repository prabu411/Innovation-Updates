const Application = require('../models/Application');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/registrationModel');

exports.getApplicationsWithDetails = async (req, res) => {
  try {
    console.log('Getting applications and registrations with manual join...');
    
    // Get all applications
    const applications = await Application.find().sort('-createdAt');
    console.log('Found applications:', applications.length);
    
    // Get all registrations
    const registrations = await Registration.find().sort('-createdAt');
    console.log('Found registrations:', registrations.length);
    
    // Manually get details for applications
    const detailedApplications = [];
    
    for (const app of applications) {
      const student = await User.findById(app.student);
      const hackathon = await Hackathon.findById(app.hackathon);
      
      if (student && hackathon) {
        detailedApplications.push({
          _id: app._id,
          student: {
            _id: student._id,
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
            section: student.section
          },
          hackathon: {
            _id: hackathon._id,
            name: hackathon.name,
            dates: hackathon.dates,
            mode: hackathon.mode
          },
          status: app.status || 'pending',
          createdAt: app.createdAt,
          type: 'application'
        });
      }
    }
    
    // Manually get details for registrations
    for (const reg of registrations) {
      const student = await User.findById(reg.user);
      const hackathon = await Hackathon.findById(reg.hackathon);
      
      if (student && hackathon) {
        detailedApplications.push({
          _id: reg._id,
          student: {
            _id: student._id,
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
            section: student.section
          },
          hackathon: {
            _id: hackathon._id,
            name: hackathon.name,
            dates: hackathon.dates,
            mode: hackathon.mode
          },
          status: 'registered',
          createdAt: reg.createdAt || reg.registrationDate,
          type: 'registration'
        });
      }
    }
    
    // Sort by creation date
    detailedApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('Total detailed records:', detailedApplications.length);
    res.json(detailedApplications);
    
  } catch (error) {
    console.error('Error getting detailed applications:', error);
    res.status(500).json({ message: error.message });
  }
};