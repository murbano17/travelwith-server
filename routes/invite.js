const express = require("express");
const inviteRoute = express.Router();
const createError = require("http-errors");
const User = require("../models/user");

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");
const Invite = require("../models/Invite");

//GET /invite
inviteRoute.get("/", isLoggedIn(), async (req, res, next) => {
  try {
    const inviteList = await Invite.find();
    if (inviteList.length === 0) {
      res.status(200).json({ message: "InviteList is empty." });
      return;
    } else {
      res.status(200).json(inviteList);
      return;
    }
  } catch (error) {
    console.log("Error while getting invite list.", error);
  }
});


module.exports = inviteRoute;
