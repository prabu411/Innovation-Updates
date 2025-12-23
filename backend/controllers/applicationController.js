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
    console.log('Fetching all applications...');
    
    // Get applications with manual population
    const applications = await Application.find().sort('-createdAt');
    console.log('Found raw applications:', applications.length);
    
    const populatedApplications = [];
    
    for (const app of applications) {
      try {
        const student = await User.findById(app.student);
        const hackathon = await Hackathon.findById(app.hackathon);
        
        if (student && hackathon) {
          populatedApplications.push({
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
      } catch (err) {
        console.error('Error processing application:', app._id, err);
      }
    }
    
    console.log('Populated applications:', populatedApplications.length);
    res.json(populatedApplications);
    
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    res.status(500).json({ message: error.message });
  }
};
