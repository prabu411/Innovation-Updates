const express = require('express');
const { getApplicationsWithDetails } = require('../controllers/detailedApplicationController');
const { protect, coordinatorOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, coordinatorOnly, getApplicationsWithDetails);

module.exports = router;