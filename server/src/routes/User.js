const express = require("express");
const { getSessionHandler, deleteSessionHandler } = require("../controllers/Session");
const {
  verifyOtpHandler,
  resendOtpHandler,
  userSignupHandler,
  userLoginHandler,
  sendResetUserPasswordEmailHandler,
  resetUserPasswordHandler,
  refreshUserAccessToken,
} = require("../controllers/User");
const { deserializeUser } = require("../middleware/Auth");
const { checkSignup } = require("../middleware/Signup");
const userRouter = express.Router();

userRouter.route("/api/user/register").post(checkSignup, userSignupHandler);
userRouter.route("/api/user/login").post(userLoginHandler);
userRouter.route("/api/sessions").get(deserializeUser, getSessionHandler);
userRouter.route("/api/user/logout").delete(deserializeUser, deleteSessionHandler);
userRouter.route("/api/user/verifyOtp").post(verifyOtpHandler);
userRouter.route("/api/user/resendOtp").get(resendOtpHandler);
userRouter.route("/api/user/requestPasswordReset").post(sendResetUserPasswordEmailHandler);
userRouter.route("/api/user/resetPassword").post(resetUserPasswordHandler);

userRouter.route("/api/user/refreshAccessToken").post(refreshUserAccessToken);

module.exports = {
  userRouter,
};
