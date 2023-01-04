const mongoose = require("mongoose");

const OtpVerificationSchema = new mongoose.Schema({
  entityId: {
    type: String,
    required: ["true", "ID is required"],
  },

  otp: {
    type: String,
    required: ["true", "Otp is required"],
  },

  createdAt: Date,

  expiresAt: Date,
});

const OtpVerificationModel = mongoose.model("OtpVerification", OtpVerificationSchema);

module.exports = {
  OtpVerificationModel,
};
