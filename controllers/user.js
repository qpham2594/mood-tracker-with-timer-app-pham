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

// daily quote
// use axios to obtain the quote and because there are multiple options on how the quote could look, using the specific index helps extracting exactly what I want to render
// Because it is a blockquote, I want to remove that element and obtain just the quote and author, so cheerio was installed
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
// using lean() here to get the information in plain JS so that it's easier to manipulate and work with
// this will display all mood entries that have been put in by the user
// in the HBS file, the user will have the option to edit and delete the entry of their choosing from this page
const moodTracking = async function get (req,res) {
  try {
    const moodEntries = await moodEntry.find().lean();  
    return moodEntries;
  } catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
  }
};

// form for new entry
// in the homepage where the daily quote is displayed, there will be an option to either view all entries if the user just wants to look at the trend of their mood or they can add a new entry
// if they decide to add a new entry, it will send a request the render the new entry form so the user can put in their mood and reflection for the day
// for this HBS file, there are date, mood, and description for user to input the information
const newEntryForm = function get(req, res) {
  res.render('newEntryForm', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error.");
    } else {
      console.log("Controllers/user.js:After rendering the form:", req.session.isLoggedIn);
    }
  });
};

// adding new entry
// when they are done filling out the form and hit submit or add entry, this will trigger POST to then add the info to the schema and save it with the username
// the ObjectId will be utilize later to edit and delete
const createNewEntry = async function post(req, res) {
  try {
    const { date, mood, description } = req.body;
   
    const user = req.body.username;

    const addingEntry = new moodEntry({
      user: user,
      date: date,
      mood: mood,
      description: description,
    });

    await addingEntry.save();

    // lean() is used directly in queries to get plain JS objects directly from database
    // toObject() is for existing Mongoose document and concert it to plain JS object, useful if needs to do other things
    // to the document before sending it elsewhere

    const plainData = addingEntry.toObject(); // Convert to a plain JavaScript object
    return plainData;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// edit form
// after the new entry is posted, there is a button right there if the user needs to edit a mistake from the entry that was just created
// this edit form will use the id of the entry and render the edit form, which takes them back to their original input to edit
const editForm = async function get(req, res) {
  try {
    const moodEditForm = await moodEntry.findById(req.params.id);
    return moodEditForm;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error.');
  }
};

// edited entry
// after the edit form is submited, it will be updated using the id and $set to update the new information that was put in
const entryEdit = async function post(req, res) {
  try {
    const id = req.params.id;
    const { date, mood, description } = req.body;

    const entryUpdate = await moodEntry.findByIdAndUpdate(
      id,
      { $set: { date, mood, description } },
      { new: true }
    );
    return entryUpdate;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// delete entry
// when the user wants to delete an entry, it will trigger delete using the id of the entry
// the process of delete will be handle through frontend script and this since there is no DELETE method in HBS so we have to work around it
const deleteEntry = async function postDelete(req, res) {
  try {
    const deletedEntry = await moodEntry.deleteOne({ _id: req.params.id });
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
