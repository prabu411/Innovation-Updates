const mongoose = require('mongoose');

const odFormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ODForm', odFormSchema);
