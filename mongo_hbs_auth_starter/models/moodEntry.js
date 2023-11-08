const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const entry = mongoose.model('MoodEntry', moodEntrySchema);

module.exports = entry;
