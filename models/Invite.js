const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inviteSchema = new Schema(
  {
    inviteBy: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: { type: String, required: true },
    inviteTo: {type: Schema.Types.ObjectId, ref: 'Travel'},
    isPending: {type: Boolean, default: true}
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;
