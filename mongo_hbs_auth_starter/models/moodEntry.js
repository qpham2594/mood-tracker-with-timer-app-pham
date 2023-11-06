const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({

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

const newEntry = mongoose.model('newEntry', moodEntrySchema);

module.exports = newEntry;
