const router = require("express").Router();
const controllers = require("../controllers");
const { deleteEntry, editForm, updatedEntryPost } = require("../controllers/user");
const checkAuth = require("../middleware/auth");
const moodEntry = require("../models/moodEntry");


router.get("/", ({ session: { isLoggedIn } }, res) => {
  res.render("index", { isLoggedIn });
});

router.get("/login", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("login", { error: req.query.error });
});

router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("signup", { error: req.query.error });
});

router.get("/private", checkAuth, ({ session: { isLoggedIn } }, res) => {
  res.render("protected", { isLoggedIn });

});

/* ------------------- Quynh's code ---------------------- */

// About page
// route to take user to /about and check for authentication and make sure session is active

router.get('/about', checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      res.render('about', {isLoggedIn});
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Pomodoro Timer
// timer is set in HBS, but the route here will take user to the timer when clicking on it in the navigation bar
// still making sure authentication is in check, and making sure session is active for that user

router.get('/pomodoro-timer', checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      res.render('pomodoroTimer', {isLoggedIn});
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Mood Tracker Daily Quote
// rendering the dailyquote from controllers.user.js with under the URL /mood-app
router.get("/mood-app", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      const singleQuote = await controllers.user.dailyQuote();
      res.render("moodTracking", { isLoggedIn, singleQuote });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Mood Tracker Homepage
// route to get all entries  with authentication and active session
router.get("/all-entries", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      const moodEntries = await controllers.user.moodTracking();
      res.render("allEntries", { isLoggedIn, moodEntries });
    } else {
      res.redirect("/mood-app");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// New Entry Form 
// route to get the new entry form for user to put in information 
router.get("/new-entry-form", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      const newForm = await controllers.user.newEntryForm({ session: { isLoggedIn } }, res);
      res.render("newEntryForm", { isLoggedIn, newForm });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// New Entry Post
// post route handling to save and display the new entry
// returning the body here since controllers.user.js used req.body to put in date, mood, and description info
router.post("/new-entry-post", checkAuth, async ({ session: { isLoggedIn }, body }, res) => {
  try {
    if (isLoggedIn) {
    const newEntryPost = await controllers.user.createNewEntry({ session: { isLoggedIn }, body }, res);
    res.render("newEntry", { isLoggedIn, newEntryPost });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// Edit Entry Form
// using id in req here because we used id to track which user it is in controllers.user.js
// also used body in req because we need it when we are editing for the update
// toObject() to get to plain JS - noticed it didn't display without it 
router.get("/edit-entry/:id", checkAuth, async ({ params: { id }, session: { isLoggedIn }, body }, res) => {
  try {
    if (isLoggedIn) {
      const formEdit = await controllers.user.editForm({params: {id}, body});
      const formEditObj = formEdit.toObject();
      res.render("editForm", { isLoggedIn, formEdit: formEditObj, id }); 
      return formEdit;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});


// Edited Entry Post
// once again using id and body here because of how we defined both in controllers.user.js
// redirecting it back to all entries page after editing
router.post("/update-entry/:id", checkAuth, async ({ params: { id }, session: { isLoggedIn }, body }, res) => {
  try {
    if (isLoggedIn){
      const editedPost = await controllers.user.entryEdit({params:{id}, body});
      res.redirect("/all-entries");
      return editedPost;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// Delete Entry
// because on front-end, we can't do method of DELETE in HBS, we use get here, so that we can execute DELETE from controllers.user.js and frontend script
router.get("/delete-entry/:id", checkAuth, async ({ params: { id }, session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      const removePost = await deleteEntry({params: {id}});
      res.redirect("/all-entries");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});


/* ------------------- Quynh's code ---------------------- */ 

module.exports = router;

