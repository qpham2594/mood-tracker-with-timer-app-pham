const { Schema, model, models } = require("mongoose");



const moodEntrySchema = new Schema({

  date: {
    type: Date,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
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

module.exports = models.moodEntry || model("MoodEntry", moodEntrySchema);


