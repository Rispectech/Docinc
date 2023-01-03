const mongoose = require("mongoose");
const { userSchema } = require("./User");

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamp: true,
  }
);

const sessionModel = mongoose.model("Session", sessionSchema);
module.exports = {
  sessionModel,
};
