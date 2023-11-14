const { Schema, model, models } = require("mongoose");

const moodEntrySchema = new Schema({

  user: { 
    type: Schema.Types.ObjectId,
    ref: 'User', // referencing to the User model
    required: false,
  },

  date: {
    type: String,
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

const moodEntry = model('moodEntry', moodEntrySchema);

module.exports = moodEntry;


