const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
  entityId: String,
  resetString: String,
  createdAt: Date,
  expiresAt: Date,
});

const resetPasswordModel = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = {
  resetPasswordModel,
};
