const { User } = require("../models");
const axios = require('axios');


async function create(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.redirect("/signup?error=must include username and password");

    const user = await User.create({ username, password });

    if (!user) return res.redirect("/signup?error=error creating new user");

    req.session.isLoggedIn = true;
    req.session.save(() => res.redirect("/"));
  } catch (err) {
    console.log(err);
    return res.redirect(`/signup?error=${err.message}`);
  }
}
/* ------------------- Quynh's code ---------------------- */

const dailyQuote = async() => {
  try {
    const zenQuote = await axios.get('https://zenquotes.io/api/today/jVfM1SXcyTJ3P7mG6cBzVQ==0xadIKmDngYPuzcz');
    return zenQuote.data;
  }catch(error){
    console.error('Unable to get daily quote due to error', error);
    return[];
  }
}

const MoodEntry = require("../models/moodEntry.js");

// showing all entries
const moodTracking = async (req,res) => {
  try {
    const moodEntries = await MoodEntry.find({userId: req.user.id});
    res.render('index', {moodEntries})
  } catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
  }
};

// finding and showing one entry

const findEntry = async (req,res) => {
  try {
    const entryId = await MoodEntry.findById(req.params.id);
    res.render('findEntry', {entryId})
  } catch (error)
  { console.error(error);
  res.status(500).send('Internal Server Error')
  }
};

// form for new entry

const newEntryForm = async (req,res) => {
  res.render('newEntryForm')
};

// adding new entry

const createNewEntry = async (req,res) => {
  try {
    const addingEntry = new MoodEntry({
      userId: req.user.id,
      mood: req.body.mood,
      description: req.body.description
    });

  await addingEntry.save();
  res.redirect('/new-entry');

}catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error')
}
};

// edit form

const editForm = async (req,res) => {
  try {
  const moodEditForm = await MoodEntry.findById(req.params.id);
  res.render('entryEdit', {moodEditForm});
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error')
}
}

// edit entry

const entryEdit = async (req,res) => {
  try {
    const currentEntry = await MoodEntry.findById(req.params.id);
    currentEntry.userId = req.user.id;
    await currentEntry.save()
    res.redirect('/');
  } catch(error) {
    console.error(error);
    res.status(500).send('Internal Server Error')
  }
}

// delete entry

const deleteEntry = async (req,res) => {
  try {
    await MoodEntry.findByIdAndRemove(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  create,
  dailyQuote,
  moodTracking,
  findEntry,
  newEntryForm,
  createNewEntry,
  editForm,
  entryEdit,
  deleteEntry
 };

 /* ------------------- Quynh's code ---------------------- */