const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: String,
    password: String,
    username: String,
    profilePic: {
      type: String,
      default: "./images/profile-picture.png",
    },
    userFrom: String,
    userAge: Number,
    about: String,
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
    asignTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
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
