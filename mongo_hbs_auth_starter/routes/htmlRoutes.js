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
router.get('/mood-entries', async (req, res) => {
  const singleQuote = await controllers.fetchZenQuotes();
  res.render('index', { zenQuotes });
});

router.get("/mood-app", checkAuth, async (req,res) => controllers.moodTracking (req,res));
router.get("/mood-entry/:id", checkAuth, async (req,res) => controllers.findEntry (req,res));
router.get("/new-entry", checkAuth, async (req,res) =>controllers.newEntryForm (req,res));
router.post("/new-entry", checkAuth, async (req,res) => controllers.newEntry (req,res));
router.get("/edit-entry/:id", checkAuth, async (req,res) => controllers.editForm (req,res)) ;
router.post("/edit-entry/:id", checkAuth, async (req,res) => controllers.entryEdit (req,res));
router.delete("/delete-entry/:id", checkAuth, async (req,res) => controllers.deleteEntry (req,res));
/* ------------------- Quynh's code ---------------------- */ 

});


module.exports = router;
