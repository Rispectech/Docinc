const bcrypt = require("bcrypt");
const { userModel } = require("../models/User");

const { otpVerificationModel } = require("../models/VerifiedOtp");
const { sendOtpVerificationEmail } = require("../services/Mail");
const { createSession } = require("../services/Session");
const {
  createUser,
  findUser,
  sendResetEmail,
  validateUserPassword,
} = require("../services/User");
const { CreateErrorClass } = require("../utils/error");
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

const userSignupHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const db_user = await findUser({ email: body.email });

    if (db_user) {
      next(CreateErrorClass(500, "failure", "User already Present"));
    }
    const user = await createUser(body);

    const verifiedOtp = await sendOtpVerificationEmail(user.email, user._id);

    console.log(verifiedOtp);
    const user_obj = user.toObject();
    delete user_obj.password;
    // console.log(user_obj);
    res.status(200).json({ status: "success", data: user_obj });
  } catch (error) {
    console.log(error);
  }
};

const userLoginHandler = async (req, res, next) => {
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

const verifyOtpHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const body_otp = req.body.otp;

    if (!userId && !body_otp) {
      return res.status(500).json({
        status: "failure",
        message: "Empty otp is not allowed",
      });
    }

    const userOtpRecords = await otpVerificationModel.find({ entityId: userId });
    if (userOtpRecords.length < 0) {
      res.status(500).json({
        status: "failure",
        message: "Account Record doesnt exist . Please login or signin",
      });
    }

    console.log(userOtpRecords);

    const { expiresAt, otp } = userOtpRecords[0];

    // if (expiresAt < Date.now()) {
    //   await otpVerificationModel.deleteMany({ entityId: userId });
    //   return res.status(500).json({
    //     status: "failure",
    //     message: "Code has expired . Please request again",
    //   });
    // }

    console.log(body_otp, otp);

    const validOtp = await bcrypt.compare(body_otp, otp);

    console.log(validOtp);

    if (!validOtp) {
      return res.status(500).json({
        status: "failure",
        message: "Invalid OTP",
      });
    }

    await userModel.updateOne({ _id: userId }, { verified: true });
    await otpVerificationModel.deleteMany({ _id: userId });
    return res.status(200).json({
      status: "success",
      message: "User is verified",
    });
  } catch (error) {
    console.log(error);
  }
};

const resendOtpHandler = async (req, res) => {
  try {
    const { _id, email } = req.user;

    await otpVerificationModel.deleteMany({ entityId: _id });
    const data = await sendOtpVerificationEmail(email, _id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {}
};

const resetUserPasswordHandler = async (req, res) => {
  try {
    const user = req.user;
    const redirectUrl = req.body.redirectUrl;

    if (!user.verified) {
      console.log(error);
      res.status(500).json({ status: "failure", message: "User not verified" });
    }

    const newPasswordReturn = await sendResetEmail(user, redirectUrl);
    res.status(200).json({
      status: "Pending",
      message: "Resend Link sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failure", message: "couldnt reset password" });
  }
};
module.exports = {
  userSignupHandler,
  userLoginHandler,
  verifyOtpHandler,
  resendOtpHandler,
  resetUserPasswordHandler,
};
