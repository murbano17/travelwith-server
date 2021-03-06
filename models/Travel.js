const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelSchema = new Schema(
  {
    travelName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    coverPic: { type: String },
    files: [{ type: String }],
    isPublic: { type: Boolean, default: false },
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
    invitationList: [{
      type: Schema.Types.ObjectId,
      ref: 'Invite',
    }],
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
