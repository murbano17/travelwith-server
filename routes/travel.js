const express = require("express");
const travelRouter = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");
const parser = require("./../config/cloudinary");

// helper functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");
const Travel = require("../models/Travel");

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
      });
      res.status(200).json(newTravel);
      return;
    } catch (error) {
      console.log(error);
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

      res.status(200).json(travelFound)
      return;
    } catch (error) {
        console.log(error);
    }
  }
);

//

module.exports = travelRouter;
