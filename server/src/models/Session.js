const mongoose = require("mongoose");
const { userSchema } = require("./User");

const sessionSchema = mongoose.Schema(
  {
    entity: {
      type: String,
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
