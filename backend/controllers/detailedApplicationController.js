const Application = require('../models/Application');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

exports.getApplicationsWithDetails = async (req, res) => {
  try {
    console.log('Getting applications with manual join...');
    
    // Get all applications
    const applications = await Application.find().sort('-createdAt');
    console.log('Found applications:', applications.length);
    
    // Manually get student and hackathon details
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
          createdAt: app.createdAt
        });
      }
    }
    
    console.log('Detailed applications:', detailedApplications.length);
    res.json(detailedApplications);
    
  } catch (error) {
    console.error('Error getting detailed applications:', error);
    res.status(500).json({ message: error.message });
  }
};