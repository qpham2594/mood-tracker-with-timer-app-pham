const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");



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
router.get("/mood-app", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      const moodEntries = await controllers.user.moodTracking(req, res);
      res.render("moodTracking", { isLoggedIn, moodEntries });
      return;
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
      console.log("Routes/html.js: Before rendering the form:", isLoggedIn);
      await controllers.user.newEntryForm({ session: { isLoggedIn } }, res);
      res.render("newEntryForm", { isLoggedIn });
      return;
    }
  } catch (error) {
    console.error("Routes/htmlRoutes.js: After rendering the form:", isLoggedIn);
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// New Entry Post
router.post("/new-entry-post", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    if (isLoggedIn) {
      await controllers.user.createNewEntry({ session: { isLoggedIn } }, res);
      res.render("newEntry", { isLoggedIn });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// Edit Entry Form
router.get("/edit-entry/:id", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    await controllers.user.editForm({ session: { isLoggedIn } }, res);
    if (isLoggedIn) {
      res.render("editForm", { isLoggedIn });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

// Edit Entry Post

router.post("/edit-entry/:id", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    await controllers.user.entryEdit({ session: { isLoggedIn } }, res);
    if (isLoggedIn) {
      res.render("entryEdit", { isLoggedIn });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});


// Delete Entry
router.delete("/delete-entry/:id", checkAuth, async ({ session: { isLoggedIn } }, res) => {
  try {
    await controllers.user.deleteEntry({ session: { isLoggedIn } }, res);
    if (isLoggedIn) {
      res.redirect("/mood-app");
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

/* ------------------- Quynh's code ---------------------- */ 




module.exports = router;
