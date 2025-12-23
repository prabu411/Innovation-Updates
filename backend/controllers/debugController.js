const Application = require('../models/Application');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

exports.debugApplications = async (req, res) => {
  try {
    console.log('=== DEBUG: Checking Applications ===');
    
    // Get raw applications
    const rawApplications = await Application.find().lean();
    console.log('Raw applications count:', rawApplications.length);
    console.log('Sample raw application:', rawApplications[0]);
    
    // Check if referenced users exist
    if (rawApplications.length > 0) {
      const studentIds = rawApplications.map(app => app.student);
      const hackathonIds = rawApplications.map(app => app.hackathon);
      
      const users = await User.find({ _id: { $in: studentIds } }).lean();
      const hackathons = await Hackathon.find({ _id: { $in: hackathonIds } }).lean();
      
      console.log('Referenced users found:', users.length);
      console.log('Referenced hackathons found:', hackathons.length);
      console.log('Sample user:', users[0]);
      console.log('Sample hackathon:', hackathons[0]);
    }
    
    // Try populate
    const populatedApplications = await Application.find()
      .populate('student', 'name email rollNumber department year section')
      .populate('hackathon', 'name dates mode')
      .lean();
    
    console.log('Populated applications:', populatedApplications.length);
    console.log('Sample populated application:', populatedApplications[0]);
    
    res.json({
      rawCount: rawApplications.length,
      populatedCount: populatedApplications.length,
      sampleRaw: rawApplications[0],
      samplePopulated: populatedApplications[0]
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
};