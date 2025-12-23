const mongoose = require('mongoose');
const Application = require('./models/Application');
const User = require('./models/User');
const Hackathon = require('./models/Hackathon');
require('dotenv').config();

const fixApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all applications
    const applications = await Application.find().populate('student').populate('hackathon');
    console.log('Found applications:', applications.length);

    // Check which applications have missing student data
    const brokenApps = applications.filter(app => !app.student);
    console.log('Applications with missing students:', brokenApps.length);

    if (brokenApps.length > 0) {
      console.log('Deleting broken applications...');
      await Application.deleteMany({ student: { $exists: false } });
      await Application.deleteMany({ student: null });
      console.log('Deleted broken applications');
    }

    // Get existing students and hackathons
    const students = await User.find({ role: 'student' });
    const hackathons = await Hackathon.find();
    
    console.log('Available students:', students.length);
    console.log('Available hackathons:', hackathons.length);

    if (students.length > 0 && hackathons.length > 0) {
      // Create some test applications with proper references
      const testApplications = [];
      
      for (let i = 0; i < Math.min(students.length, 3); i++) {
        for (let j = 0; j < Math.min(hackathons.length, 2); j++) {
          // Check if application already exists
          const existing = await Application.findOne({
            student: students[i]._id,
            hackathon: hackathons[j]._id
          });
          
          if (!existing) {
            testApplications.push({
              student: students[i]._id,
              hackathon: hackathons[j]._id,
              status: 'pending'
            });
          }
        }
      }

      if (testApplications.length > 0) {
        await Application.create(testApplications);
        console.log('Created test applications:', testApplications.length);
      }
    }

    // Verify the fix
    const fixedApplications = await Application.find()
      .populate('student', 'name rollNumber year section')
      .populate('hackathon', 'name');
    
    console.log('\\n✅ Fixed Applications:');
    fixedApplications.forEach(app => {
      console.log(`- ${app.student?.name || 'MISSING'} (${app.student?.rollNumber || 'N/A'}) → ${app.hackathon?.name || 'MISSING'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
};

fixApplications();