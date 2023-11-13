const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");
const cheerio = require('cheerio');




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
router.get("/mood-app", checkAuth, async(req,res) => {
  try {
    const singleQuote = await controllers.user.dailyQuote();
    if (req.session.isLoggedIn) {
      res.render("moodTracking", { isLoggedIn: req.session.isLoggedIn, singleQuote});
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

// Mood Tracker Homepage
router.get("/mood-app", checkAuth, async (req, res) => {
  try {
    //const { date } = req.query;
    const moodEntries = await controllers.user.moodTracking(req, res);

    if (req.session.isLoggedIn) {
      res.render("moodTracking", { isLoggedIn: req.session.isLoggedIn, moodEntries});
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// New Entry Form 
router.get("/new-entry-form", checkAuth, async (req,res) => {
  try {
    console.log(req.session);
    await controllers.user.newEntryForm (req,res);

    if (req.session.isLoggedIn) {
      res.render("newEntryForm", {isLoggedIn: req.session.isLoggedIn});
      return; 
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
}
);

// New Entry Post
router.post("/new-entry-post", checkAuth, async (req,res) => {
  try {
    await controllers.user.createNewEntry (req,res);
    console.log("Before trying to post", req.session.isLoggedIn);
  

    if (req.session.isLoggedIn) {
      res.render("newEntry", {isLoggedIn: req.session.isLoggedIn});
      return; 
    }
  } catch (error) {
    console.log("After trying to post", req.session.isLoggedIn);
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
}
);

// Edit Entry Form
router.get("/edit-entry/:id", checkAuth, async (req,res) => {
  try {
    await controllers.user.editForm (req,res);

    if (req.session.isLoggedIn) {
      res.render("editForm", {isLoggedIn: req.session.isLoggedIn});
      return; 
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
}
);

// Edit Entry Post

router.post("/edit-entry/:id", checkAuth, async (req,res) => {
  try {
    await controllers.user.entryEdit (req,res);

    if (req.session.isLoggedIn) {
      res.render("entryEdit", {isLoggedIn: req.session.isLoggedIn});
      return; 
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
}
);

// Delete Entry

router.delete("/delete-entry/:id", checkAuth, async (req,res) => {
  try {
    await controllers.user.deleteEntry (req,res);

    if (req.session.isLoggedIn) {
      res.render("/mood-app", {isLoggedIn: req.session.isLoggedIn});
      return; 
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
}
);

/* ------------------- Quynh's code ---------------------- */ 




module.exports = router;
