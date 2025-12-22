const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  getParticipatedStudents
} = require('../controllers/hackathonController');
const { protect, coordinatorOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', protect, coordinatorOnly, upload.single('poster'), createHackathon);
router.get('/', protect, getAllHackathons);
router.get('/participated-students', protect, coordinatorOnly, getParticipatedStudents);
router.get('/:id', protect, getHackathonById);
router.put('/:id', protect, coordinatorOnly, upload.single('poster'), updateHackathon);
router.delete('/:id', protect, coordinatorOnly, deleteHackathon);

module.exports = router;
