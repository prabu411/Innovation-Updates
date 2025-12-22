const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    const { name, type } = req.body;
    const newDocument = await Document.create({
      name: name || req.file.originalname,
      path: req.file.path,
      type: type || 'od_form',
      uploadedBy: req.user.id,
    });

    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const documents = await Document.find(query).sort('-createdAt');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    // Note: This doesn't delete the file from the filesystem to allow for recovery.
    // A more robust solution would use a cron job or a proper file deletion strategy.
    res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
