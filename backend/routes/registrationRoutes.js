const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, registrationController.createRegistration);
router.get('/', authMiddleware, registrationController.getRegistrations);

module.exports = router;
