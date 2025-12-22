const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, coordinatorOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', protect, coordinatorOnly, upload.single('document'), uploadDocument);
router.get('/', protect, getDocuments);
router.delete('/:id', protect, coordinatorOnly, deleteDocument);

module.exports = router;
