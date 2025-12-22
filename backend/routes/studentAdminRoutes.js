const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDemoStudents, updateDemoStudent } = require('../controllers/studentAdminController');

const studentAdminOnly = (req, res, next) => {
  console.log('Student Admin check - User role:', req.user.role);
  if (req.user.role !== 'student_admin' && req.user.role !== 'student-admin') {
    return res.status(403).json({ message: 'Access denied: Student Admin only' });
  }
  next();
};

router.get('/students', protect, getDemoStudents);
router.put('/students/:id', protect, updateDemoStudent);

module.exports = router;
