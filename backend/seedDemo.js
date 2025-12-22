const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Hackathon = require('./models/Hackathon');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Create demo student
    const studentExists = await User.findOne({ email: 'ganeshprabu@gmail.com' });
    if (!studentExists) {
      const hashedPassword = await bcrypt.hash('12345', 10);
      await User.create({
        name: 'Ganesh Prabu',
        email: 'ganeshprabu@gmail.com',
        password: hashedPassword,
        role: 'student',
        rollNumber: '21CS001',
        department: 'Computer Science and Engineering',
        year: 2,
        section: 'A'
      });
      console.log('✓ Demo student created');
    } else {
      console.log('✓ Demo student already exists');
    }
    
    // Create demo coordinator
    const coordExists = await User.findOne({ email: 'studentinnovation@gmail.com' });
    if (!coordExists) {
      const hashedPassword = await bcrypt.hash('stu1234', 10);
      await User.create({
        name: 'Innovation Coordinator',
        email: 'studentinnovation@gmail.com',
        password: hashedPassword,
        role: 'coordinator',
        department: 'Innovation Cell'
      });
      console.log('✓ Demo coordinator created');
    } else {
      console.log('✓ Demo coordinator already exists');
    }
    
    // Create sample hackathon
    let hack = await Hackathon.findOne({ name: 'Smart India Hackathon 2024' });
    if (!hack) {
      const coord = await User.findOne({ role: 'coordinator' });
      hack = await Hackathon.create({
        name: 'Smart India Hackathon 2024',
        organizer: 'Government of India',
        dates: [new Date('2024-03-15')],
        mode: 'hybrid',
        description: 'National level hackathon for innovative solutions to real-world problems',
        location: 'Multiple Cities',
        prizePool: '₹1 Crore',
        themes: ['Healthcare', 'Education', 'Agriculture', 'Smart Cities'],
        registrationLink: 'https://sih.gov.in',
        collegeDBLink: 'https://forms.google.com/sih-college',
        createdBy: coord._id
      });
      console.log('✓ Sample hackathon created');
    } else {
      console.log('✓ Sample hackathon already exists');
    }

    // Create a sample application for the demo student
    const demoStudent = await User.findOne({ email: 'ganeshprabu@gmail.com' });
    const Application = require('./models/Application');
    const appExists = await Application.findOne({ hackathon: hack._id, student: demoStudent._id });
    if (!appExists) {
      await Application.create({ hackathon: hack._id, student: demoStudent._id, status: 'approved' });
      console.log('✓ Demo application created');
    } else {
      console.log('✓ Demo application already exists');
    }
    
    console.log('\n✅ Demo data setup complete!');
    console.log('\nLogin credentials:');
    console.log('Student: ganeshprabu@gmail.com / 12345');
    console.log('Admin: studentinnovation@gmail.com / stu1234');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
