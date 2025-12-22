const mongoose = require('mongoose');
const Hackathon = require('./models/Hackathon');
const User = require('./models/User');
const Application = require('./models/Application');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

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

    // Create test students
    const student1 = await User.create({
      name: 'Ganesh Prabu',
      email: 'ganesh.prabu@student.com',
      password: 'password123',
      role: 'student',
      rollNumber: '7376221CS001',
      department: 'CSE',
      year: 2,
      section: 'A'
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@student.com', 
      password: 'password123',
      role: 'student',
      rollNumber: '7376221CS002',
      department: 'CSE',
      year: 2,
      section: 'A'
    });

    const student3 = await User.create({
      name: 'Raj Kumar',
      email: 'raj.kumar@student.com',
      password: 'password123', 
      role: 'student',
      rollNumber: '7376221CS003',
      department: 'CSE',
      year: 2,
      section: 'B'
    });

    // Create applications
    await Application.create({
      hackathon: hackathon._id,
      student: student1._id
    });

    await Application.create({
      hackathon: hackathon._id,
      student: student2._id
    });

    await Application.create({
      hackathon: hackathon._id,
      student: student3._id
    });

    console.log('✅ Seed data created successfully!');
    console.log('- 1 hackathon created');
    console.log('- 3 students created');
    console.log('- 3 applications created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();