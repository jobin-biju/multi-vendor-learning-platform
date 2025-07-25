const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  lessonId: String,
  currentTime: Number,
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

// const VideoProgress = mongoose.model('VideoProgress', videoProgressSchema);

// // POST: Save progress
// router.post('/video-progress', async (req, res) => {
//   const { userId, courseId, lessonId, currentTime } = req.body;
//   try {
//     const result = await VideoProgress.findOneAndUpdate(
//       { userId, courseId, lessonId },
//       { currentTime, updatedAt: new Date() },
//       { upsert: true, new: true }
//     );
//     res.json({ message: 'Progress saved', result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to save progress' });
//   }
// });

// // POST: Mark video complete
// router.post('/video-complete', async (req, res) => {
//   const { userId, courseId, lessonId } = req.body;
//   try {
//     const result = await VideoProgress.findOneAndUpdate(
//       { userId, courseId, lessonId },
//       { completed: true, updatedAt: new Date() },
//       { upsert: true, new: true }
//     );
//     res.json({ message: 'Marked complete', result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to mark complete' });
//   }
// });

// // GET: Get last saved time and completion
// router.get('/video-progress', async (req, res) => {
//   const { userId, courseId, lessonId } = req.query;
//   try {
//     const progress = await VideoProgress.findOne({ userId, courseId, lessonId });
//     res.json({
//       currentTime: progress?.currentTime || 0,
//       completed: progress?.completed || false
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch progress' });
//   }
// });

// // GET: Get all completed lessonIds for a course
// router.post('/video-complete', async (req, res) => {
//   const { userId, courseId, lessonId } = req.body;

//   try {
//     const updated = await VideoProgress.findOneAndUpdate(
//       { userId, courseId, lessonId },
//       { completed: true, updatedAt: new Date() },
//       { upsert: true, new: true }
//     );
//     res.json({ message: 'Marked as completed', updated });
//   } catch (err) {
//     console.error('Error in /video-complete:', err);
//     res.status(500).json({ error: 'Failed to mark complete' });
//   }
// });

module.exports = router;
