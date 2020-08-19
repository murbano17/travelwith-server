const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelSchema = new Schema(
  {
    travelName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    coverPic: { type: String },
    files: [{ type: String }],
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
