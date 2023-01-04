const express = require("express");
const { getSessionHandler, deleteSessionHandler } = require("../controllers/Session");
const {
  verifyOtpHandler,
  resendOtpHandler,
  userSignupHandler,
  userLoginHandler,
  sendResetUserPasswordEmailHandler,
  resetUserPasswordHandler,
} = require("../controllers/User");
const { deserializeUser } = require("../middleware/Auth");
const { checkSignup } = require("../middleware/Signup");
const userRouter = express.Router();

userRouter.route("/api/user/register").post(checkSignup, userSignupHandler);
userRouter.route("/api/user/login").post(userLoginHandler);
userRouter.route("/api/sessions").get(deserializeUser, getSessionHandler);
userRouter.route("/api/user/logout").delete(deserializeUser, deleteSessionHandler);
userRouter.route("/api/user/verifyOtp").post(deserializeUser, verifyOtpHandler);
userRouter.route("/api/user/resendOtp").get(deserializeUser, resendOtpHandler);
userRouter
  .route("/api/user/requestPasswordReset")
  .post(deserializeUser, sendResetUserPasswordEmailHandler);

userRouter.route("/api/user/resetPassword").post(deserializeUser, resetUserPasswordHandler);

module.exports = {
  userRouter,
};
