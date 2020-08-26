const express = require("express");
const inviteRoute = express.Router();
const createError = require("http-errors");
const User = require("../models/User");

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");
const Invite = require("../models/Invite");

//GET /invite
inviteRoute.get("/", isLoggedIn(), async (req, res, next) => {
  try {
    const inviteList = await Invite.find().populate('inviteTo')
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

//POST deleteInvite
inviteRoute.post('/:id/delete', isLoggedIn(), async(req, res, next) => {
  const inviteId = req.params.id;

  try {
    const inviteFound = await Invite.findById(inviteId);
    if(inviteFound.guestEmail == req.session.currentUser.email) {
      await Invite.findByIdAndDelete(inviteId);
      res.status(200).json({message: 'Invite deleted by user'});
      return;
    }
  } catch (error) {
    console.log('Error while deleting invite', error);
    
  }
})


module.exports = inviteRoute;
