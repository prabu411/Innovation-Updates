const User = require('../models/User');
const Application = require('../models/Application');

exports.getDemoStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate({ path: 'applications', populate: { path: 'hackathon' } })
      .select('-password')
      .limit(50);
    
    const studentsWithApplications = await Promise.all(students.map(async (student) => {
      const applications = await Application.find({ student: student._id })
        .populate('hackathon', 'name dates mode');
      return { ...student.toObject(), applications };
    }));

    res.json(studentsWithApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDemoStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const student = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
