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
 router.get("/", checkAuth, controllers.moodTracking);
 router.get("/mood-entry/:id", checkAuth, controllers.findEntry);
 router.get("/new-entry", checkAuth, controllers.newEntryForm);
 router.post("/new-entry", checkAuth, controllers.newEntry);
 router.get("/edit-entry/:id", checkAuth, controllers.editForm);
 router.put("/edit-entry/:id", checkAuth, controllers.entryEdit);
 router.delete("/delete-entry/:id", checkAuth, controllers.deleteEntry);
/* ------------------- Quynh's code ---------------------- */
module.exports = router;
