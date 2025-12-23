const Application = require('../models/Application');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

exports.testData = async (req, res) => {
  try {
    // Get counts
    const appCount = await Application.countDocuments();
    const userCount = await User.countDocuments({ role: 'student' });
    const hackCount = await Hackathon.countDocuments();
    
    // Get raw data
    const apps = await Application.find().limit(5);
    const users = await User.find({ role: 'student' }).limit(5);
    const hacks = await Hackathon.find().limit(5);
    
    res.json({
      counts: {
        applications: appCount,
        students: userCount,
        hackathons: hackCount
      },
      samples: {
        applications: apps,
        students: users.map(u => ({ _id: u._id, name: u.name, email: u.email })),
        hackathons: hacks.map(h => ({ _id: h._id, name: h.name }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};