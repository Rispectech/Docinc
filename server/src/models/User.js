const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
    },

    picture: String,

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
  userSchema,
};
