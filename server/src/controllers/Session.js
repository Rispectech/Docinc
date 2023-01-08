const { userModel } = require("../models/User");
const { createSession, findSession, updateSession } = require("../services/Session");
const { validateUserPassword } = require("../services/User");
const { CreateErrorClass } = require("../utils/error");
const { signJwt, verifyJwt } = require("../utils/Jwt");

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

const createSessionHandler = async (req, res, next) => {
  try {
    const userBody = req.body;
    const user = await userModel.findOne({ email: userBody.email });

    if (!user) res.status(500).json({ status: "failure", message: "Invalid Email" });

    if (!userBody.password) {
      return next(CreateErrorClass(500, "failure", "Password is required"));
    }
    if (!validateUserPassword(userBody.password, user))
      res.status(500).json({ status: "failure", message: "Invalid Password" });

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
    const userId = req.user._id;
    // console.log("controller", userId);
    const sessions = await findSession({ user: userId, valid: true });
    return res.status(200).json({ status: "success", data: sessions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failure", message: "couldnt get session" });
  }
};

const deleteSessionHandler = async (req, res) => {
  try {
    const sessionId = req.user.session;
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
