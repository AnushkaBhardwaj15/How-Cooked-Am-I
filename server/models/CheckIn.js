const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Stored as 'YYYY-MM-DD' to prevent duplicate check-ins per day in user timezone
    required: true
  },
  sleepHours: {
    type: Number,
    required: true
  },
  studyHours: {
    type: Number,
    required: true
  },
  screenTime: {
    type: Number,
    required: true
  },
  assignments: {
    type: Number,
    required: true
  },
  dsaSolved: {
    type: Number,
    required: true
  },
  cookedScore: {
    type: Number,
    required: true
  },
  archetype: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Enforce single check-in per user per day
CheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CheckIn', CheckInSchema);
