const { Schema, model, models } = require("mongoose");
const mongoose = require('mongoose'); // Import mongoose????
const bcrypt = require("bcrypt");
const MoodEntry = require('./moodEntry'); // Adjust the path to moodEntry.js

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    moodEntries: [
      {
        type: mongoose.Schema.Types.ObjectId, // another way to reference mongoose?
        ref: 'MoodEntry', // Reference the MoodEntry model
      },
    ],
  },
  {
    methods: {
      checkPassword(password) {
        return bcrypt.compare(password, this.password);
      },
    },
  }
);

// hashes the password before it's stored in mongo
UserSchema.pre("save", async function (next) {
  // the isNew check prevents mongoose from re-hashing the password when the user is updated for any reason
  if (this.isNew)
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = models.User || model("User", UserSchema);


