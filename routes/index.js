var express = require("express");
var router = express.Router();
const userModel = require("./users");
const urlModel = require("./url");
const passport = require("passport");
const multer = require("multer"); // Import the Multer middleware setup
const shortid = require("shortid");
const path = require("path");

// Set up multer middleware
const upload = multer();

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate())); // in dono line se user login hota hai

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") }); // login.ejs mein jha jha error likh ho wha value ye wali de
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/analytics", async function (req, res, next) {
  const user = await userModel
  .findOne({
    username: req.session.passport.user,
  })
  .populate("Urls");
  res.render("analytics", {user});
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("Urls");
  console.log(user);
  res.render("profile", { user });
});

router.post("/register", function (req, res) {
  // this is working
  const userData = new userModel({
    username: req.body.username,
  });
  userModel.register(userData, req.body.password)
  .then(function () {
    passport.authenticate("local")(req, res, 
      function () {
      res.redirect("/profile");
    }
    );
  });
});

router.post(
  // this is also working
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {

  }
);



router.post("/makeMoreUrls", isLoggedIn, upload.none(),async function (req, res, next) {
  // console.log(req.body); // {}

  // find user
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });

  // acquire original url
  const originalUrl = req.body["originalUrl"];
  console.log(originalUrl);
  // make shortId url
  const shortID = shortid();

  // make a url in database
  const urlCreated = await urlModel.create({
    user: user._id,
    shortId: shortID,
    redirectURL: originalUrl,
    visitHistory: [],
  });
  

  // in the user update its url input
  user.Urls.push(urlCreated._id);
  await user.save();

  res.redirect("/profile");


});



router.get("/redirect/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await urlModel.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});






function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
