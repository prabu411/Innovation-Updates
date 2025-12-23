const mongoose = require('mongoose');
const Application = require('./models/Application');
const User = require('./models/User');
require('dotenv').config();

const diagnose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get raw applications without populate
    const rawApps = await Application.find();
    console.log('\\n📊 Raw Applications:');
    rawApps.forEach((app, i) => {
      console.log(`${i + 1}. ID: ${app._id}`);
      console.log(`   Student ID: ${app.student} (Type: ${typeof app.student})`);
      console.log(`   Hackathon ID: ${app.hackathon}`);
      console.log(`   Valid ObjectId: ${mongoose.Types.ObjectId.isValid(app.student)}`);
    });

    // Check if students exist
    console.log('\\n👥 Checking Students:');
    for (const app of rawApps) {
      const student = await User.findById(app.student);
      console.log(`Student ${app.student}: ${student ? `✅ ${student.name}` : '❌ NOT FOUND'}`);
    }

    // Try manual populate
    console.log('\\n🔍 Manual Populate Test:');
    const populatedApps = await Application.find()
      .populate({
        path: 'student',
        select: 'name email rollNumber department year section'
      });
    
    populatedApps.forEach((app, i) => {
      console.log(`${i + 1}. ${app.student ? `✅ ${app.student.name}` : '❌ No student data'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
    process.exit(1);
  }
};

diagnose();