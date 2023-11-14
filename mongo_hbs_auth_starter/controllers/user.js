const { User } = require("../models");
const axios = require('axios');
const moodEntry = require ('../models/moodEntry');
const cheerio = require('cheerio');


async function create(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.redirect("/signup?error=must include username and password");

    const user = await User.create({ username, password }); // user is what will be used to get to id
    console.log(user);

    if (!user) return res.redirect("/signup?error=error creating new user");

    req.session.isLoggedIn = true;
    req.session.save(() => res.redirect("/"));
  } catch (err) {
    console.log(err);
    return res.redirect(`/signup?error=${err.message}`);
  }
}

/* ------------------- Quynh's code ---------------------- */

// daily quote - link is working
const dailyQuote = async function get() {
  try {
    const zenQuote = await axios.get('https://zenquotes.io/api/today/jVfM1SXcyTJ3P7mG6cBzVQ==0xadIKmDngYPuzcz');
    const quote = zenQuote.data[0].h;
    const blockQuote = cheerio.load(quote);
    const text = blockQuote('blockquote').text();
    return text;
  }catch(error){
    console.error('Unable to get daily quote due to error', error);
    return[];
  }
}


// showing all entries
const moodTracking = async function get (req,res) {
  try {
    const moodEntries = await moodEntry (req,res);
    res.render('moodTracking', {moodEntries})
  } catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
  }
};

// form for new entry

const newEntryForm = function get(req, res) {
  console.log("Controllers/user.js: Before rendering the form:", req.session.isLoggedIn);
  
  res.render('newEntryForm', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error.");
    } else {
      console.log("Controllers/user.js:After rendering the form:", req.session.isLoggedIn);
    }
  });
};

// adding new entry

const createNewEntry = async function post(req, res) {

  try {
    console.log("Controllers/user.js:Before trying to post", req.session.isLoggedIn);
    console.log("Request body:", req.body);

    const {date, mood, description} = req.body;
    //const username = req.user;

    const addingEntry = new moodEntry({
      user: req.body.username,
      date: date,
      mood: mood,
      description: description,
    });

    await addingEntry.save();
   
    const leanEntry = await moodEntry.findById(addingEntry._id).lean();
  
    res.render('newEntry', { addingEntry: leanEntry });
  } catch (error) {
    console.log("Controllers/user.js: After trying to post", req.session.isLoggedIn);
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// edit form

const editForm = async function get (req,res) {
  try {
  const moodEditForm = await moodEntry.findById(req.params.id);
  res.render('entryEdit', {moodEditForm});
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error')
}
};

// edit entry

const entryEdit = async function post (req,res) {
  try {
    const currentEntry = await moodEntry.findById(req.params.id);
    await currentEntry.save()
    res.redirect('/mood-app');
  } catch(error) {
    console.error(error);
    res.status(500).send('Internal Server Error')
  }
};

// delete entry

const deleteEntry = async (req,res) => {
  try {
    await moodEntry.findByIdAndRemove(req.params.id);
    res.redirect('/mood-app');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  create,
  dailyQuote,
  moodTracking,
  newEntryForm,
  createNewEntry,
  editForm,
  entryEdit,
  deleteEntry
 };

 /* ------------------- Quynh's code ---------------------- */