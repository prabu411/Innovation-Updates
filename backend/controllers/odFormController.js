const ODForm = require('../models/ODForm');
const path = require('path');

exports.uploadODForm = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const odForm = await ODForm.create({
      title: req.body.title || 'Innovation OD Form',
      filePath: req.file.path,
      uploadedBy: req.user.id
    });
    res.status(201).json(odForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestODForm = async (req, res) => {
  try {
    const odForm = await ODForm.findOne().sort({ createdAt: -1 });
    res.json(odForm || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllODForms = async (req, res) => {
  try {
    const forms = await ODForm.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
