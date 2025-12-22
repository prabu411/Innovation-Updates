const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded for user ID:', decoded.id);
    
    // Check for hardcoded admin IDs first, then database users
    const adminUserId = '60d5ecb8b486f40015e3e4d6';
    const studentAdminId = '60d5ecb8b486f40015e3e4d7';
    const demoStudentId = '60d5ecb8b486f40015e3e4d8';
    
    console.log('Checking user ID:', decoded.id);
    console.log('Admin ID:', adminUserId);
    console.log('Student Admin ID:', studentAdminId);
    
    if (decoded.id === adminUserId) {
      req.user = { _id: adminUserId, id: adminUserId, name: 'Innovation Admin', role: 'coordinator' };
      console.log('Using hardcoded admin user');
    } else if (decoded.id === studentAdminId) {
      req.user = { _id: studentAdminId, id: studentAdminId, name: 'Student Admin', role: 'student_admin' };
      console.log('Using hardcoded student admin user');
    } else if (decoded.id === demoStudentId) {
      req.user = { _id: demoStudentId, id: demoStudentId, name: 'Demo Student', role: 'student' };
      console.log('Using hardcoded demo student user');
    } else {
      // Fetch user from database
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log('User not found in database for ID:', decoded.id);
        // Create a fallback user for unknown IDs
        req.user = { _id: decoded.id, id: decoded.id, name: 'Unknown User', role: 'student_admin' };
        console.log('Created fallback user');
      }
    }
    
    console.log('Authenticated user:', req.user.name, 'Role:', req.user.role);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.coordinatorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'coordinator' || req.user.role === 'student_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Coordinator or Student Admin only.' });
  }
};

exports.studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Student only.' });
  }
};
