const express = require("express");
const { googleOauthHandler } = require("../controllers/auth");
const { getSessionHandler } = require("../controllers/Session");
const { createUserHandler } = require("../controllers/User");
const { deserializeUser } = require("../middleware/Auth");
const { checkSignup } = require("../middleware/Signup");
const userRouter = express.Router();

userRouter.route("/api/users").post(checkSignup, createUserHandler);
userRouter.route("/api/sessions/get").post(deserializeUser, getSessionHandler);
userRouter.route("/api/sessions").post(createUserHandler);
userRouter;

module.exports = {
  userRouter,
};
