// MongoDB schema (videoProgress.js)
const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  lessonId: String,
  currentTime: Number,
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
