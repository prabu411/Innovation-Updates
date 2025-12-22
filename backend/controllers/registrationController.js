const Registration = require('../models/registrationModel');

exports.createRegistration = async (req, res) => {
  try {
    const { hackathon } = req.body;
    const newRegistration = new Registration({
      hackathon,
      user: req.user._id,
    });
    await newRegistration.save();
    res.status(201).json(newRegistration);
  } catch (error) {
    // If duplicate registration (unique index), return existing record instead of error
    if (error.code === 11000) {
      try {
        const existing = await Registration.findOne({ hackathon: req.body.hackathon, user: req.user._id }).populate('hackathon');
        return res.status(200).json(existing);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getRegistrations = async (req, res) => {
  try {
    console.log('Fetching registrations for role:', req.user.role);
    // Coordinators and Student Admins can view all registrations with populated user data
    const registrations = await Registration.find()
      .populate('hackathon', 'name dates mode')
      .populate('user', 'name email rollNumber department year section')
      .sort('-createdAt');
    
    console.log('Found registrations:', registrations.length);
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error in getRegistrations:', error);
    res.status(500).json({ message: error.message });
  }
};
