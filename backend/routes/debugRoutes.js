const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debugController');

router.get('/applications', debugController.debugApplications);

module.exports = router;