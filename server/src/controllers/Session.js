const { userModel } = require("../models/User");
const { createSession, findSession, updateSession } = require("../services/Session");
const { validateUserPassword } = require("../services/User");
const { signJwt } = require("../utils/Jwt");

const accessTokenCookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

const createSessionHandler = async (req, res) => {
  try {
    const userBody = req.body;
    const user = userModel.find(userBody.email === email);

    if (!user) res.status(500).json({ status: "failure", message: "Invalid Email" });

    if (!validateUserPassword())
      res.status(500).json({ staus: "failure", message: "Invalid Password" });

    const session = createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({ status: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failure", message: "couldnt create session" });
  }
};

const getSessionHandler = async (req, res) => {
  try {
    const userId = req.locals.user._id;
    const sessions = findSession({ userId: userId, valid: true });
    return res.status(200).json({ status: "success", data: sessions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failure", message: "couldnt get session" });
  }
};

const deleteSessionHandler = async (req, res) => {
  try {
    const sessionId = req.local.user.session;
    await updateSession({ _id: sessionId, valid: false });
    return res.status(200).json({
      status: "success",
      data: {
        accessToken: null,
        refreshToken: null,
      },
    });
  } catch (error) {}
};
module.exports = {
  getSessionHandler,
  createSessionHandler,
  deleteSessionHandler,
};
