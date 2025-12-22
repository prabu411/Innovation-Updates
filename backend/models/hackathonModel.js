const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
  },
  organizer: {
    type: String,
  },
  dates: {
    type: [Date],
    required: true,
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  prizePool: {
    type: String,
  },
  themes: {
    type: [String],
  },
  registrationLink: {
    type: String,
  },
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
