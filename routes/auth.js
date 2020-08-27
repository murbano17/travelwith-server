const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User");
const parser = require("./../config/cloudinary");
const Travel = require("../models/Travel");

// helper functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");
const Invite = require("../models/Invite");

//Signup /POST
router.post(
  "/signup",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const profilePic = req.body.profilePic
      ? req.body.profilePic
      : '../assets/images/profile-picture.png'
    const {
      username,
      password,
      email,
      userFrom,
      userBirthdate,
      about,
    } = req.body;
    try {
      const emailExists = await User.findOne({ email }, "email");
      if (emailExists) return next(createError(400));
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const emailHasInvitation = await Invite.find({ guestEmail: email });
        
        const newUser = await User.create({
          username,
          password: hashPass,
          email,
          profilePic,
          userFrom,
          userBirthdate,
          about,
          pendingInvitation: emailHasInvitation ? emailHasInvitation : null,
        });

        req.session.currentUser = newUser;
        res.status(200).json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

//login POST
router.post(
  "/login",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

//Logout POST
router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  res.status(204).send();
  return;
});

//GET '/'
router.get("/", isLoggedIn(), (req, res, next) => {
  res.status(200).json({ message: "User is logged in " });
});

//GET '/me'
router.get('/me', isLoggedIn(), (req, res, next) => {
  req.session.currentUser.password = '*'
  res.json(req.session.currentUser)
})

module.exports = router;
