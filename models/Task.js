const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    taskName: {type: String, required: true},
    taskCreator: { type: Schema.Types.ObjectId, ref: "User" },
    taskDeadline: { type: Date, default: null },
    taskNote: {type: String, default: null},
    assignTo: [{ type: Schema.Types.ObjectId, ref: "User", default: null }],
    doneTask: { type: Boolean, default: false },
    completedBy: {type: Schema.Types.ObjectId, ref: 'User', default: null}
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
