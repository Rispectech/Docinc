const express = require("express");
const { getSessionHandler, deleteSessionHandler } = require("../controllers/Session");
const {
  verifyOtpHandler,
  resendOtpHandler,
  clientSignupHandler,
  clientLoginHandler,
  sendResetClientPasswordEmailHandler,
  resetClientPasswordHandler,
} = require("../controllers/client");
const { deserializeClient } = require("../middleware/Auth");
const { checkSignup } = require("../middleware/Signup");
const clientRouter = express.Router();

clientRouter.route("/api/client/register").post(checkSignup, clientSignupHandler);
clientRouter.route("/api/client/login").post(clientLoginHandler);
clientRouter.route("/api/sessions").get(deserializeClient, getSessionHandler);
clientRouter.route("/api/client/logout").delete(deserializeClient, deleteSessionHandler);
clientRouter.route("/api/client/verifyOtp").post(deserializeClient, verifyOtpHandler);
clientRouter.route("/api/client/resendOtp").get(deserializeClient, resendOtpHandler);
clientRouter
  .route("/api/client/requestPasswordReset")
  .post(deserializeclient, sendResetclientPasswordEmailHandler);

clientRouter
  .route("/api/client/resetPassword")
  .post(deserializeclient, resetclientPasswordHandler);

module.exports = {
  clientRouter,
};