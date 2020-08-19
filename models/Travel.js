const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelSchema = new Schema(
  {
    travelName: String,
    startDate: Date,
    endDate: Date,
    origin: String,
    destination: String,
    coverPic: {
      type: String,
      default: "./images/profile-picture.png",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    travelMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    files: [{ type: String }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Travel = mongoose.model("Travel", travelSchema);

module.exports = Travel;
