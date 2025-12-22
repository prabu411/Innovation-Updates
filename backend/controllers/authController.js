const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, year, section } = req.body;
    // Validate required student fields server-side for clarity
    if (role === 'student') {
      const missing = [];
      if (!rollNumber) missing.push('rollNumber');
      if (!year) missing.push('year');
      if (!section) missing.push('section');
      if (missing.length) {
        return res.status(400).json({ message: `Missing required student field(s): ${missing.join(', ')}` });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role, rollNumber, year, section });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, year, section } = req.body;

    // --- Backdoor Logins for Demo ---
    if (email === 'admin@innovation.com' && password === 'sece@123') {
      const adminUserId = '60d5ecb8b486f40015e3e4d6';
      return res.json({ _id: adminUserId, name: 'Innovation Admin', email, role: 'coordinator', token: generateToken(adminUserId) });
    }
    if (email === 'studentinnovation@gmail.com' && password === 'stu1234') {
      const studentAdminId = '60d5ecb8b486f40015e3e4d7';
      return res.json({ _id: studentAdminId, name: 'Student Admin', email, role: 'student_admin', token: generateToken(studentAdminId) });
    }
    if (email === 'ganeshprabu@gmail.com' && password === '12345') {
      const demoStudentId = '60d5ecb8b486f40015e3e4d8';
      return res.json({ _id: demoStudentId, name: 'Ganesh Prabu', email, role: 'student', year: 2, section: 'A', department: 'CSE', token: generateToken(demoStudentId) });
    }
    // --- End of Backdoor Logins ---

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If user is a student, update their year and section upon login
    if (user.role === 'student') {
      if (year) user.year = year;
      if (section) user.section = section;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      year: user.year,
      section: user.section,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const adminUserId = '60d5ecb8b486f40015e3e4d6';
    const studentAdminId = '60d5ecb8b486f40015e3e4d7';
    const demoStudentId = '60d5ecb8b486f40015e3e4d8';

    if (req.user.id === adminUserId) {
      return res.json({ _id: adminUserId, name: 'Innovation Admin', email: 'admin@innovation.com', role: 'coordinator' });
    }
    if (req.user.id === studentAdminId) {
      return res.json({ _id: studentAdminId, name: 'Student Admin', email: 'studentinnovation@gmail.com', role: 'student_admin' });
    }
    if (req.user.id === demoStudentId) {
      return res.json({ _id: demoStudentId, name: 'Ganesh Prabu', email: 'ganeshprabu@gmail.com', role: 'student', year: 2, section: 'A', department: 'CSE' });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data.' });
  }
};
