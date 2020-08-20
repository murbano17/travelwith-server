const express = require("express");
const parser = require("./../config/cloudinary");
const profileRouter = express.Router();
const User = require("../models/user");

// HELPER functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");
const { findById } = require("../models/user");

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

//GET profile/:id

profileRouter.get("/:id", isLoggedIn(), async (req, res, next) => {
  userId = req.params.id;
  try {
    const userFound = await User.findById(userId);
    if (!userFound) {
      res.status(400).json({ message: "User not found" });
      return;
    } else {
      res.status(200).json(userFound);
      return;
    }
  } catch (error) {
    console.log("Error while searching profile");
  }
});

module.exports = profileRouter;
