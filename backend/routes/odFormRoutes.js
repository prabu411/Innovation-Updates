const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, coordinatorOnly } = require('../middleware/auth');
const { uploadODForm, getLatestODForm, getAllODForms } = require('../controllers/odFormController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/odforms/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/', protect, coordinatorOnly, upload.single('odForm'), uploadODForm);
router.get('/latest', protect, getLatestODForm);
router.get('/', protect, getAllODForms);

module.exports = router;
