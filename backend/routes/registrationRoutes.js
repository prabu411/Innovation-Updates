const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect, coordinatorOnly } = require('../middleware/auth');

router.post('/', protect, registrationController.createRegistration);
router.get('/', protect, coordinatorOnly, registrationController.getRegistrations);

module.exports = router;
