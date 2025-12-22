const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

applicationSchema.index({ hackathon: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
