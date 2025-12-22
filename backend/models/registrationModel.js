const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate registrations by the same user for the same hackathon
registrationSchema.index({ hackathon: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
