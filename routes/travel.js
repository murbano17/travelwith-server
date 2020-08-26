const express = require("express");
const travelRouter = express.Router();
const createError = require("http-errors");
const parser = require("./../config/cloudinary");
const Travel = require("../models/Travel");
const User = require("../models/User");
const Invite = require("../models/Invite");
const Task = require("../models/Task");

// helper functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

// POST createTravel
travelRouter.post("/create", isLoggedIn(), async (req, res, next) => {
  const coverPic = req.body.coverPic
    ? req.body.coverPic
    : "/images/cover-travel.jpg";

  const {
    travelName,
    startDate,
    endDate,
    origin,
    destination,
    isPublic,
  } = req.body;

  if (
    travelName === "" ||
    startDate === "" ||
    endDate === "" ||
    origin === "" ||
    destination === " "
  ) {
    next(createError(400));
  }

  try {
    const newTravel = await Travel.create({
      travelName,
      startDate,
      endDate,
      origin,
      destination,
      owner: req.session.currentUser._id,
      travelMembers: [req.session.currentUser._id],
      isPublic,
      coverPic,
    });
    const userFound = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      { $push: { ownTravels: newTravel._id } },
      { new: true }
    );
    res.status(200).json(newTravel);
    return;
  } catch (error) {
    console.log("Error while creating new travel.", error);
  }
});

//POST editTravel
travelRouter.patch("/edit/:id", isLoggedIn(), async (req, res, next) => {
  const travelId = req.params.id;
  const { travelName, startDate, endDate, origin, destination, isPublic } = req.body;
  try {
    const originalTravel = await Travel.findById(travelId);
    const coverPic = req.body.coverPic
      ? req.body.coverPic
      : originalTravel.coverPic;

    const travelFound = await Travel.findByIdAndUpdate(
      travelId,
      { travelName, startDate, endDate, origin, destination, coverPic, isPublic },
      { new: true }
    );

    res.status(200).json(travelFound);
    return;
  } catch (error) {
    console.log("Error while editing travel", error);
  }
});

//POST deleteTravel
travelRouter.post("/delete/:id", isLoggedIn(), async (req, res, next) => {
  const travelId = req.params.id;

  try {
    const travelFound = await Travel.findById(travelId);
    if (travelFound.owner == req.session.currentUser._id) {
      await Travel.findByIdAndDelete(travelId);
      res.status(200).json({ message: "Travel erased successfully." });
      return;
    }
  } catch (error) {
    console.log("Error while deleting travel", error);
  }
});

//GET travel

travelRouter.get("/", isLoggedIn(), async (req, res, next) => {
  try {
    const allTravels = await Travel.find()
      .populate("travelMembers")
      .populate("owner")
      .populate("tasks");
    if (allTravels.length == 0) {
      res.status(200).json({ message: "Travels are empty" });
      return;
    } else {
      res.status(200).json(allTravels);
      return;
    }
  } catch (error) {
    console.log("Error while getting travels");
  }
});

//GET travel/:id
travelRouter.get("/:id", isLoggedIn(), async (req, res, next) => {
  const travelId = req.params.id;

  try {
    const travelFound = await Travel.findById(travelId).populate("tasks");
    if (!travelFound) {
      res.status(400).json({ message: "Travel not found" });
      return;
    } else {
      res.status(200).json(travelFound);
      return;
    }
  } catch (error) {
    console.log("Error while searching travel");
  }
});

//POST /createinvite
travelRouter.post("/:id/createinvite", isLoggedIn(), async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const { guestEmail } = req.body;
  const inviteTo = req.params.id;
  try {
    const newInvite = await Invite.create({ guestEmail, userId, inviteTo });
    if (!newInvite) {
      res.status(400).json({ message: "Error in invite creation" });
      return;
    } else {
      const travelFound = await Travel.findByIdAndUpdate(
        inviteTo,
        { $push: { invitationList: newInvite } },
        { new: true }
      );
      const userFound = await User.findOne({ email: guestEmail });
      if (userFound) {
        userFound.pendingInvitation.push(newInvite);
      }
      // const userFound = await User.findByIdAndUpdate(
      //   userId,
      //   { $push: { pendingInvitation: newInvite } },
      //   { new: true }
      // );
      res.status(200).json(newInvite);
      return;
    }
  } catch (error) {
    console.log("Error while creating invite", error);
  }
});

//POST /:id/createtask
travelRouter.post("/:id/createtask", isLoggedIn(), async (req, res, next) => {
  const { taskName, taskDeadline, assignTo } = req.body;
  const travelId = req.params.id;
  try {
    if (taskName === "") {
      next(createError(400));
    }
    const newTask = await Task.create({
      taskName,
      taskDeadline,
      assignTo,
      includesInTravel: travelId,
      taskCreator: req.session.currentUser._id,
    });
    const travelFound = await Travel.findByIdAndUpdate(
      travelId,
      { $push: { tasks: newTask } },
      { new: true }
    );
    res.status(200).json(travelFound);
    return;
  } catch (error) {
    console.log("Error while creating task", error);
  }
});

//POST joinTravel
travelRouter.post("/:id/join", isLoggedIn(), async (req, res, next) => {
  const travelId = req.params.id;
  const userId = req.session.currentUser._id;

  try {
    const userFound = await User.findByIdAndUpdate(
      userId,
      { $push: { joinTravels: travelId } },
      { new: true }
    );
    const travelFound = await Travel.findByIdAndUpdate(
      travelId,
      { $push: { travelMembers: userId } },
      { new: true }
    );
    if (!userFound) {
      res.status(400).json({ message: "User not found" });
      return;
    } else {
      const invitationFound = await Invite.findOne({
        guestEmail: userFound.email,
        inviteTo: travelFound._id,
      });
      if (!invitationFound) {
        next();
      }

      const updateInvitationList = await Travel.findByIdAndUpdate(
        travelFound._id,
        { $pull: { invitationList: invitationFound._id } },
        { new: true }
      );
      res.status(200).json(userFound);
      return;
    }
  } catch (error) {
    console.log("Error while joining a travel.", error);
  }
});

module.exports = travelRouter;
