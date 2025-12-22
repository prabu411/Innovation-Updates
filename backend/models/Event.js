const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Hackathon', 'Workshop', 'Competition', 'Seminar', 'Bootcamp'], required: true },
  organizer: { type: String, required: true },
  partnerOrganization: String,
  mode: { type: String, enum: ['online', 'offline', 'hybrid'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: Date,
  venue: String,
  platformLink: String,
  themes: [String],
  skillTags: [String],
  prizePool: String,
  eligibility: String,
  maxParticipants: Number,
  registrationLink: String,
  collegeODLink: String,
  poster: String,
  status: { type: String, enum: ['draft', 'published', 'active', 'completed', 'archived'], default: 'draft' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  winners: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    position: String,
    prize: String
  }],
  feedback: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
