
const mongoose = require('mongoose');

const lessonCompletionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userRegister', required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'instructorRegister', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lesson' }],
    totalLessons: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('LessonCompletion', lessonCompletionSchema);
