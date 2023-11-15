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
    const moodEntries = await moodEntry.find().lean();  
    return moodEntries;
  } catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
  }
};

// form for new entry

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
    //const moodEntries = await moodEntry.find() 

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
const editForm = async function get (id) {
  try {
    console.log(id);
    const moodEditForm = await moodEntry.findById(id);
    console.log(moodEditForm);
    return moodEditForm;
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// edited entry
const entryEdit = async function post (req,res) {
  try {
    const id = req.params.id;
    console.log("id is here:", id);
    const entryUpdate = await moodEntry.findByIdAndUpdate(
      id,
      {date, mood, description}, 
      {new:true})
    await entryUpdate.save();
    console.log(entryUpdate);

    const finalEdit = entryUpdate.toObject();
    console.log(finalEdit);
    return finalEdit;
  } catch(error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// delete entry

const deleteEntry = async function deleteEntry(req,res) {
  try {
    const postDelete = await moodEntry.findByIdAndDelete(req.params.id);
    console.log(postDelete);
    return postDelete;
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