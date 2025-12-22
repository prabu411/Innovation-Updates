const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  bulkApproveApplications,
  generateCertificate,
  sendBulkNotification,
  getEventAnalytics
} = require('../controllers/advancedCoordinatorController');

const coordinatorOnly = (req, res, next) => {
  if (req.user.role !== 'coordinator') {
    return res.status(403).json({ message: 'Access denied: Coordinator only' });
  }
  next();
};

router.get('/stats', protect, coordinatorOnly, getDashboardStats);
router.post('/applications/bulk-approve', protect, coordinatorOnly, bulkApproveApplications);
router.post('/certificates/generate', protect, coordinatorOnly, generateCertificate);
router.post('/notifications/send-bulk', protect, coordinatorOnly, sendBulkNotification);
router.get('/events/:eventId/analytics', protect, coordinatorOnly, getEventAnalytics);

module.exports = router;
