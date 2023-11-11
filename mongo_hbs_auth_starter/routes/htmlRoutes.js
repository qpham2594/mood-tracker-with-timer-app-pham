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

// trying to figure out the issue here
// quote is not showing, empty h2 is rendering instead

router.get("/mood-app", checkAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const singleQuote = await controllers.user.dailyQuote();
    const moodEntries = await controllers.user.moodTracking(req, res);

    if (req.session.isLoggedIn) {
      res.render("moodTracking", { isLoggedIn: req.session.isLoggedIn, singleQuote, moodEntries, selectedDate: date });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



router.get("/mood-entry/:id", checkAuth, async (req,res) => {
  if (req.session.isLoggedIn) {
    try {
      await controllers.user.findEntry (req,res);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error.");
    }
  }
});
  
router.get("/new-entry", checkAuth, async (req,res) => controllers.user.newEntryForm (req,res));
router.post("/new-entry-post", checkAuth, async (req,res) => controllers.user.createNewEntry (req,res));
router.get("/edit-entry/:id", checkAuth, async (req,res) => controllers.user.editForm (req,res)) ;
router.post("/edit-entry/:id", checkAuth, async (req,res) => controllers.user.entryEdit (req,res));
router.delete("/delete-entry/:id", checkAuth, async (req,res) => controllers.user.deleteEntry (req,res));



/* ------------------- Quynh's code ---------------------- */ 




module.exports = router;
