const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
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

    companyEmail: {
      type: String,
      required: [true, "Email is required"],
    },

    address: {
      type: String,
    },
    companyMobile: {
      type: String,
      required: [true, "Mobile is required"],
    },

    gst: {
      type: String,
      required: [true, "Gst number is required"],
    },

    mobile: {
      type: String,
      required: [true, "Mobile Number is required"],
    },

    license: {
      type: String,
      required: [true, "License is required"],
      enum: ["Qr Based", "Tenure Based"],
    },

    qr: {
      type: Number,
      required: [true, "QR qouta is required"],
    },

    organization: {
      type: String,
      required: [true, "Organization is required"],
      enum: ["Education", "Bank", "Insurance", "Others"],
    },
  },
  {
    timestamps: true,
  }
);

const clientModel = mongoose.model("Client", clientSchema);

module.exports = {
  clientModel,
  clientSchema,
};
