const { Schema, model, models } = require("mongoose");



const moodEntrySchema = new Schema({

  date: {
    type: Date,
    required: true,
  },

  username: {
    type: Schema.ObjectId,
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

const entry = model('moodEntry', moodEntrySchema);

module.exports = entry;


