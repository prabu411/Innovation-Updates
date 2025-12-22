const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  certificateNumber: { type: String, unique: true, required: true },
  type: { type: String, enum: ['participation', 'winner', 'excellence'], required: true },
  position: String,
  issueDate: { type: Date, default: Date.now },
  verificationCode: String,
  pdfPath: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
