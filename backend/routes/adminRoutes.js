const express = require('express');
const { resetData } = require('../controllers/adminController');
const { protect, coordinatorOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/reset-data', protect, coordinatorOnly, resetData);

module.exports = router;