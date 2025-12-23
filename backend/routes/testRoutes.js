const express = require('express');
const { testData } = require('../controllers/testController');
const { protect, coordinatorOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, coordinatorOnly, testData);

module.exports = router;