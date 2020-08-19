const express = require("express");
const parser = require("./../config/cloudinary");
const profileRouter = express.Router();
const User = require("../models/user");


// helper functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//POST editProfile

profileRouter.post(
  "/edit/:id",
  isLoggedIn(),
  parser.single("profilePic"),
  async (req, res, next) => {
    const { username, userFrom, userAge, about } = req.body;
    const profilePic = req.file
      ? req.file.secure_url
      : req.session.currentUser.profilePic;
    const userId = req.params.id;

    try {
      if (userId == req.session.currentUser._id) {
        const userFound = await User.findByIdAndUpdate(
          userId,
          { username, userFrom, userAge, about, profilePic },
          { new: true }
        );
        if (userFound) {
          res.status(200).json(userFound);
          return;
        }
      }
    } catch (error) {
      console.log("Error while editing profile.", error);
    }
  }
);

module.exports = profileRouter;
