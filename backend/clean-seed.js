const mongoose = require('mongoose');
const Hackathon = require('./models/Hackathon');
const User = require('./models/User');
const Application = require('./models/Application');
require('dotenv').config();

const cleanAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clean existing data
    await Application.deleteMany({});
    await Hackathon.deleteMany({});
    await User.deleteMany({ role: 'student' }); // Only delete students, keep admins
    console.log('✅ Cleaned existing data');

    // Create test hackathon
    const hackathon = await Hackathon.create({
      name: 'Innovation Challenge 2024',
      organizer: 'SECE Innovation Cell',
      dates: [new Date('2024-12-25')],
      mode: 'hybrid',
      description: 'Annual innovation challenge for students',
      location: 'SECE Campus',
      prizePool: '₹50,000',
      themes: ['AI/ML', 'Web Development', 'IoT'],
      registrationLink: 'https://example.com/register',
      collegeDBLink: 'https://example.com/college',
      createdBy: '60d5ecb8b486f40015e3e4d6'
    });
    console.log('✅ Created hackathon:', hackathon.name);

    // Create test students with proper data
    const students = await User.create([
      {
        name: 'Ganesh Prabu',
        email: 'ganesh.test@student.com',
        password: 'password123',
        role: 'student',
        rollNumber: '7376221CS001',
        department: 'CSE',
        year: 2,
        section: 'A'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.test@student.com', 
        password: 'password123',
        role: 'student',
        rollNumber: '7376221CS002',
        department: 'CSE',
        year: 2,
        section: 'A'
      },
      {
        name: 'Raj Kumar',
        email: 'raj.test@student.com',
        password: 'password123', 
        role: 'student',
        rollNumber: '7376221CS003',
        department: 'CSE',
        year: 2,
        section: 'B'
      },
      {
        name: 'Anita Singh',
        email: 'anita.test@student.com',
        password: 'password123', 
        role: 'student',
        rollNumber: '7376221CS004',
        department: 'CSE',
        year: 3,
        section: 'A'
      }
    ]);
    console.log('✅ Created students:', students.length);

    // Create applications
    const applications = await Application.create([
      { hackathon: hackathon._id, student: students[0]._id },
      { hackathon: hackathon._id, student: students[1]._id },
      { hackathon: hackathon._id, student: students[2]._id },
      { hackathon: hackathon._id, student: students[3]._id }
    ]);
    console.log('✅ Created applications:', applications.length);

    // Verify data
    const populatedApps = await Application.find()
      .populate('student', 'name rollNumber year section')
      .populate('hackathon', 'name');
    
    console.log('\\n📊 Verification:');
    populatedApps.forEach(app => {
      console.log(`- ${app.student.name} (${app.student.rollNumber}) Year ${app.student.year} Section ${app.student.section} → ${app.hackathon.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

cleanAndSeed();