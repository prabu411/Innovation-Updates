const Application = require('../models/Application');

exports.applyToHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.body;
    console.log('Apply to hackathon - User:', req.user._id, 'Hackathon:', hackathonId);

    const existingApplication = await Application.findOne({
      hackathon: hackathonId,
      student: req.user._id
    });

    if (existingApplication) {
      console.log('Duplicate application detected');
      return res.status(400).json({ message: 'Already applied to this hackathon' });
    }

    const application = await Application.create({
      hackathon: hackathonId,
      student: req.user._id
    });

    console.log('Application created successfully:', application);
    res.status(201).json(application);
  } catch (error) {
    console.error('Error applying to hackathon:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    console.log('Getting applications for user:', req.user._id);
    const applications = await Application.find({ student: req.user._id })
      .populate('hackathon')
      .sort('-createdAt');
    console.log('Found applications:', applications.length);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// Coordinator: Get all applications with populated student and hackathon
exports.getAllApplications = async (req, res) => {
  try {
    // First try with populate
    const applications = await Application.find()
      .populate({
        path: 'student',
        select: 'name email rollNumber department year section',
        model: 'User'
      })
      .populate({
        path: 'hackathon', 
        select: 'name dates mode',
        model: 'Hackathon'
      })
      .sort('-createdAt');
    
    // Check if populate worked
    const validApplications = applications.filter(app => 
      app.student && app.hackathon && 
      typeof app.student === 'object' && 
      typeof app.hackathon === 'object'
    );
    
    if (validApplications.length === 0 && applications.length > 0) {
      // Manual population as fallback
      const User = require('../models/User');
      const Hackathon = require('../models/Hackathon');
      
      const manualApplications = [];
      
      for (const app of applications) {
        const student = await User.findById(app.student).select('name email rollNumber department year section');
        const hackathon = await Hackathon.findById(app.hackathon).select('name dates mode');
        
        manualApplications.push({
          ...app.toObject(),
          student: student || { name: 'Unknown Student', rollNumber: 'N/A' },
          hackathon: hackathon || { name: 'Unknown Hackathon' }
        });
      }
      
      return res.json(manualApplications);
    }
    
    res.json(applications);
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    res.status(500).json({ message: error.message });
  }
};
