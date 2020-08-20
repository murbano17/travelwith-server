const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    profilePic: {
      type: String,
      default: "./images/profile-picture.png",
    },
    userFrom: {type: String, default: null},
    userAge: {type: Number, default: null},
    about: {type: String, default: null},
    ownTravels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Travel",
      },
    ],
    joinTravels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Travel",
      },
    ],
    assignTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
