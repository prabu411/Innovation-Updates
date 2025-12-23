const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const Application = require('../models/Application');

exports.resetData = async (req, res) => {
  try {
    // Only allow coordinator to reset data
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Starting data reset...');

    // Clean existing data (except admin users)
    await Application.deleteMany({});
    await Hackathon.deleteMany({});
    await User.deleteMany({ role: 'student' });
    console.log('✅ Cleaned existing data');

    // Create test hackathon
    const hackathon = await Hackathon.create({
      name: 'Smart India Hackathon 2024',
      organizer: 'Government of India',
      dates: [new Date('2024-12-25')],
      mode: 'hybrid',
      description: 'National level hackathon for innovative solutions',
      location: 'Multiple Cities',
      prizePool: '₹1,00,000',
      themes: ['AI/ML', 'Web Development', 'IoT', 'Blockchain'],
      registrationLink: 'https://sih.gov.in/register',
      collegeDBLink: 'https://sih.gov.in/college',
      createdBy: req.user.id
    });
    console.log('✅ Created hackathon:', hackathon.name);

    // Create test students
    const students = await User.create([
      {
        name: 'Ganesh Prabu B',
        email: 'ganesh.prabu@sece.ac.in',
        password: 'password123',
        role: 'student',
        rollNumber: '7376221CS001',
        department: 'CSE',
        year: 2,
        section: 'A'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@sece.ac.in', 
        password: 'password123',
        role: 'student',
        rollNumber: '7376221CS002',
        department: 'CSE',
        year: 2,
        section: 'A'
      },
      {
        name: 'Raj Kumar',
        email: 'raj.kumar@sece.ac.in',
        password: 'password123', 
        role: 'student',
        rollNumber: '7376221CS003',
        department: 'CSE',
        year: 2,
        section: 'B'
      }
    ]);
    console.log('✅ Created students:', students.length);

    // Create applications
    const applications = await Application.create([
      { hackathon: hackathon._id, student: students[0]._id, status: 'pending' },
      { hackathon: hackathon._id, student: students[1]._id, status: 'approved' },
      { hackathon: hackathon._id, student: students[2]._id, status: 'pending' }
    ]);
    console.log('✅ Created applications:', applications.length);

    // Test the populate immediately
    const testApps = await Application.find()
      .populate('student', 'name rollNumber year section department email')
      .populate('hackathon', 'name');
    
    console.log('✅ Populate test results:');
    testApps.forEach(app => {
      console.log(`- ${app.student?.name || 'NULL'} → ${app.hackathon?.name || 'NULL'}`);
    });

    res.json({
      message: 'Data reset successful',
      applications: testApps,
      summary: {
        hackathons: 1,
        students: students.length,
        applications: applications.length
      }
    });

  } catch (error) {
    console.error('Reset data error:', error);
    res.status(500).json({ message: error.message });
  }
};