const express = require("express");
const { googleOauthHandler, googleClientOauthHandler } = require("../controllers/oAuth");
const authRouter = express.Router();

// authRouter.route("/api/session/oauth/google").get(googleOauthHandler);
authRouter.route("/api/session/oauth/google").get(googleClientOauthHandler);

module.exports = {
  authRouter,
};
