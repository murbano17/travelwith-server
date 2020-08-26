const express = require("express");
const parser = require("./../config/cloudinary");
const profileRouter = express.Router();
const User = require("../models/User");

// HELPER functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//POST editProfile

profileRouter.patch(
  "/edit/:id",
  isLoggedIn(),
  async (req, res, next) => {
    const { username, userFrom, userBirthdate, about } = req.body;
    const profilePic = req.body.profilePic
      ? req.body.profilePic
      : req.session.currentUser.profilePic;
    const userId = req.params.id;

    try {
      if (userId == req.session.currentUser._id) {
        const userFound = await User.findByIdAndUpdate(
          userId,
          { username, userFrom, userBirthdate, about, profilePic },
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
    const userFound = await User.findById(userId).populate('pendingInvitation').populate('joinTravels').populate('ownTravels')
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
