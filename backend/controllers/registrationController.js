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
    // Students (role: 'innovator') should only see their own registrations.
    if (req.user.role === 'innovator') {
      const registrations = await Registration.find({ user: req.user._id }).populate('hackathon');
      return res.status(200).json(registrations);
    }
    // Coordinators / admins can view all registrations
    const registrations = await Registration.find().populate('hackathon').populate('user');
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
