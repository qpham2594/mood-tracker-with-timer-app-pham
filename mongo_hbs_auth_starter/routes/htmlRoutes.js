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

/* ------------------- Quynh's code ---------------------- */

// trying to figure out the issue here
// quote is not showing, empty h2 is rendering instead

router.get("/mood-app", async (req, res) => {
  try {
    const singleQuote = await controllers.user.dailyQuote();
    console.log("Fetched daily quote:", singleQuote);
    const moodEntries = await controllers.user.moodTracking(req, res);

    res.render("index", { singleQuote, moodEntries });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/mood-entry/:id", checkAuth, async (req,res) => controllers.user.findEntry (req,res));
router.get("/new-entry", checkAuth, async (req,res) => controllers.user.newEntryForm (req,res));
router.post("/new-entry", checkAuth, async (req,res) => controllers.user.newEntry (req,res));
router.get("/edit-entry/:id", checkAuth, async (req,res) => controllers.user.editForm (req,res)) ;
router.post("/edit-entry/:id", checkAuth, async (req,res) => controllers.user.entryEdit (req,res));
router.delete("/delete-entry/:id", checkAuth, async (req,res) => controllers.user.deleteEntry (req,res));
/* ------------------- Quynh's code ---------------------- */ 

});


module.exports = router;
