const express = require("express");
const travelRouter = express.Router();
const createError = require("http-errors");
const parser = require("./../config/cloudinary");
const Travel = require("../models/Travel");

// helper functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

// POST createTravel
travelRouter.post(
  "/create",
  isLoggedIn(),
  parser.single("coverPic"),
  async (req, res, next) => {
    const coverPic = req.file
      ? req.file.secure_url
      : "./images/cover-travel.jpg";

    const { travelName, startDate, endDate, origin, destination } = req.body;

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
      });
      res.status(200).json(newTravel);
      return;
    } catch (error) {
      console.log('Error while creating new travel.',error);
    }
  }
);

//POST editTravel
travelRouter.post(
  "/edit/:id",
  isLoggedIn(),
  parser.single("coverPic"),
  async (req, res, next) => {
    const travelId = req.params.id;
    const { travelName, startDate, endDate, origin, destination } = req.body;
    // const coverPic = req.file ? req.file.secure_url : travelFound.coverPic;

    try {
      const travelFound = await Travel.findByIdAndUpdate(
        travelId,
        { travelName, startDate, endDate, origin, destination },
        { new: true }
      );

      res.status(200).json(travelFound);
      return;
    } catch (error) {
      console.log('Error while editing travel', error);
    }
  }
);

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
    console.log('Error while deleting travel', error);
  }
});

module.exports = travelRouter;
