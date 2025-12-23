const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const Application = require('../models/Application');

exports.resetData = async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Cleaning all data...');

    // Clean ALL data except admin users
    await Application.deleteMany({});
    await Hackathon.deleteMany({});
    await User.deleteMany({ role: 'student' });
    
    console.log('✅ All data cleaned - fresh start');

    res.json({
      message: 'All data cleaned successfully. System is now ready for real student registrations.',
      summary: {
        hackathons: 0,
        students: 0,
        applications: 0
      }
    });

  } catch (error) {
    console.error('Clean data error:', error);
    res.status(500).json({ message: error.message });
  }
};