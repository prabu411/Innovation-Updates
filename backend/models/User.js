const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'coordinator'],
    required: true
  },
  rollNumber: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  department: {
    type: String,
    default: 'Computer Science and Engineering'
  },
  year: {
    type: Number,
    required: function() { return this.role === 'student'; }
  },
  section: {
    type: String,
    required: function() { return this.role === 'student'; }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
