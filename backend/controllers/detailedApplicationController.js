const Application = require('../models/Application');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/registrationModel');

exports.getApplicationsWithDetails = async (req, res) => {
  try {
    console.log('=== DATABASE DEBUG ===');
    
    // Check what's in each collection
    const applications = await Application.find();
    const registrations = await Registration.find();
    const users = await User.find({ role: 'student' });
    const hackathons = await Hackathon.find();
    
    console.log('Applications count:', applications.length);
    console.log('Registrations count:', registrations.length);
    console.log('Students count:', users.length);
    console.log('Hackathons count:', hackathons.length);
    
    // Return debug info
    res.json({
      debug: {
        applications: applications.length,
        registrations: registrations.length,
        students: users.length,
        hackathons: hackathons.length
      },
      applications: applications.map(app => ({
        _id: app._id,
        student: app.student,
        hackathon: app.hackathon,
        status: app.status,
        createdAt: app.createdAt
      })),
      registrations: registrations.map(reg => ({
        _id: reg._id,
        user: reg.user,
        hackathon: reg.hackathon,
        createdAt: reg.createdAt
      })),
      students: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber
      })),
      hackathons: hackathons.map(hack => ({
        _id: hack._id,
        name: hack.name
      }))
    });
    
  } catch (error) {
    console.error('Error getting debug info:', error);
    res.status(500).json({ message: error.message });
  }
};