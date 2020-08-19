const mongoose = require("mongoose");
const { schema } = require("./user");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    taskName: String,
    taskCreator: { type: Schema.Types.ObjectId, ref: "User" },
    taskDeadline: { type: Date, default: null },
    taskNote: String,
    asignTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    doneTask: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
