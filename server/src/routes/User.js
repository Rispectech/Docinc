const express = require("express");
const { googleOauthHandler } = require("../controllers/auth");
const {
  getSessionHandler,
  createSessionHandler,
  deleteSessionHandler,
} = require("../controllers/Session");
const { createUserHandler } = require("../controllers/User");
const { deserializeUser } = require("../middleware/Auth");
const { checkSignup } = require("../middleware/Signup");
const userRouter = express.Router();

userRouter.route("/api/users").post(checkSignup, createUserHandler);
userRouter.route("/api/sessions").post(createSessionHandler);
userRouter.route("/api/sessions").get(deserializeUser, getSessionHandler);
userRouter.route("/api/sessions").delete(deserializeUser, deleteSessionHandler);

module.exports = {
  userRouter,
};
