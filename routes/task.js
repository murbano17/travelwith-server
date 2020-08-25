const express = require("express");
const taskRouter = express.Router();
const createError = require("http-errors");
const parser = require("./../config/cloudinary");
const Travel = require("../models/Travel");
const Task = require("../models/Task");

// helper functions
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//POST createTask

// taskRouter.post("/create", isLoggedIn(), async (req, res, next) => {
//   const { taskName, taskDeadline, assignTo } = req.body;
//   try {
//     if (taskName === "") {
//       next(createError(400));
//     }

//     const newTask = await Task.create({
//       taskName,
//       taskDeadline,
//       assignTo,
//       taskCreator: req.session.currentUser._id,
//     });
//     res.status(200).json(newTask);
//     return;
//   } catch (error) {
//     console.log("Error while creating task", error);
//   }
// });

//POST editTask

taskRouter.post("/edit/:id", isLoggedIn(), async (req, res, next) => {
  const taskId = req.params.id;
  const { taskName, taskDeadline, assignTo, taskNote, doneTask } = req.body;
  try {
    const taskFound = await Task.findByIdAndUpdate(
      taskId,
      {
        taskName,
        taskDeadline,
        assignTo,
        taskNote,
        doneTask
      },
      { new: true }
    );
    if (taskFound) {
      res.status(200).json(taskFound);
      return;
    }
  } catch (error) {
    console.log("Error while editing a task.", error);
  }
});

//POST deleteTask
taskRouter.post("/delete/:id", isLoggedIn(), async (req, res, next) => {
  const taskId = req.params.id;

  try {
    const taskFound = await Task.findById(taskId);
    if (taskFound.taskCreator == req.session.currentUser._id) {
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: "Task erased successfully." });
      return;
    }
  } catch (error) {
    console.log("Error while deleting task", error);
  }
});

//GET task/:id

taskRouter.get("/:id", isLoggedIn(), async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const taskFound = await Task.findById(taskId);
    if (!taskFound) {
      res.status(400).json({ message: "Task not found" });
      return;
    } else {
      res.status(200).json(taskFound);
    }
  } catch (error) {
    console.log("Error while searching task");
  }
});

module.exports = taskRouter;
