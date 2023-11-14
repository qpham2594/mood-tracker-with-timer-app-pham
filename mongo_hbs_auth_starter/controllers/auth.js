const { User } = require("../models");

async function login(req, res) {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password)
      return res.redirect("/login?error=must include username and password");

    const user = await User.findOne({ username }); 
    console.log(user);

    if (!user)
      return res.redirect("/login?error=username or password is incorrect");

    const passwordMatches = await user.checkPassword(password);

    if (!passwordMatches)
      return res.redirect("/login?error=username or password is incorrect");

//added for tracker app
  // req.session.userId = user.username;
    
    req.session.isLoggedIn = true;
    req.session.save(() => res.redirect("/"));
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function logout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}

module.exports = { login, logout };
