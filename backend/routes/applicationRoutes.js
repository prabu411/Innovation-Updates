const express = require('express');
const { applyToHackathon, getMyApplications, getAllApplications } = require('../controllers/applicationController');
const { protect, studentOnly, coordinatorOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, studentOnly, applyToHackathon);
router.get('/my-applications', protect, studentOnly, getMyApplications);
// Coordinator: view all applications
router.get('/', protect, coordinatorOnly, getAllApplications);

module.exports = router;
