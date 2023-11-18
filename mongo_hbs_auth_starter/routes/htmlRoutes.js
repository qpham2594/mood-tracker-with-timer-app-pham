const router = require("express").Router();
const controllers = require("../controllers");
const { deleteEntry, editForm } = require("../controllers/user");
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

// Mood Tracker Daily Quote
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
router.post("/new-entry-post", checkAuth, async ({ session: { isLoggedIn }, body }, res) => {
  try {
    if (isLoggedIn) {
      // Because of isLoggedIn implemented in checkAuth, we have access directly to body
    const newEntryPost = await controllers.user.createNewEntry({ session: { isLoggedIn }, body }, res);
    console.log(newEntryPost);
    res.render("newEntry", { isLoggedIn, newEntryPost });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// Edit Entry Form
router.get("/edit-entry/:id", checkAuth, async ({ params: { id }, session: { isLoggedIn } }, res) => {
  try {

    if (isLoggedIn) {
      const formEdit = await controllers.user.editForm({params: {id}}); // Pass only the id
      console.log("router handling success:", formEdit);  
      res.render("editForm", { isLoggedIn, formEdit }); 
      return formEdit;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});


// Edited Entry Post
router.post("/update-entry/:id", checkAuth, async ({ params: { id }, session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn){
      const editedPost = await controllers.user.entryEdit(req);
      console.log(editedPost, "edited post handling")
      res.render("entryEdit", { isLoggedIn, editedPost });
      return editedPost;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// Delete Entry
router.get("/delete-entry/:id", checkAuth, async ({ params: { id }, session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      const removePost = await deleteEntry({params: {id}});
      console.log("Successfully removed post!", removePost);
      res.redirect("/all-entries");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});


/* ------------------- Quynh's code ---------------------- */ 

module.exports = router;
