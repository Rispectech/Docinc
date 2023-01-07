const bcrypt = require("bcrypt");
const { clientModel } = require("../models/Client");

const { otpVerificationModel } = require("../models/VerifiedOtp");
const { sendOtpVerificationEmail } = require("../utils/Mail");
const { createSession } = require("../services/Session");
const {
  createClient,
  findClient,
  sendResetEmail,
  validateClientPassword,
  upsertClient,
} = require("../services/Client");
const { CreateErrorClass } = require("../utils/error");
const { signJwt } = require("../utils/Jwt");
const { resetPasswordModel } = require("../models/ResetPassword");
const { compareHash, generateHash } = require("../utils/bycrpt");

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

const clientSignupHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const db_Client = await findClient({ email: body.email });

    if (db_Client) {
      next(CreateErrorClass(500, "failure", "Client already Present"));
    }
    const Client = await createClient(body);

    const verifiedOtp = await sendOtpVerificationEmail(Client.email, Client._id);

    console.log(verifiedOtp);
    const Client_obj = Client.toObject();
    delete Client_obj.password;
    // console.log(Client_obj);
    res.status(200).json({ status: "success", data: Client_obj });
  } catch (error) {
    console.log(error);
  }
};

const clientLoginHandler = async (req, res, next) => {
  try {
    const ClientBody = req.body;
    const Client = await clientModel.findOne({ email: ClientBody.email });

    if (!Client) return res.status(500).json({ status: "failure", message: "Invalid Email" });

    if (!ClientBody.password) {
      return next(CreateErrorClass(500, "failure", "Password is required"));
    }
    if (!validateClientPassword(ClientBody.password, Client))
      return res.status(500).json({ status: "failure", message: "Invalid Password" });

    const session = createSession(Client._id, req.get("Client-agent") || "");

    const accessToken = signJwt(
      {
        ClientId: Client._id,
        session: session._id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = signJwt(
      {
        ClientId: Client._id,
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
    // const ClientId = req.Client._id;
    const ClientId = req.body.id;
    const body_otp = req.body.otp;

    if (!ClientId && !body_otp) {
      return res.status(500).json({
        status: "failure",
        message: "Empty otp is not allowed",
      });
    }

    const ClientOtpRecords = await otpVerificationModel.find({ entityId: ClientId });
    if (ClientOtpRecords.length < 0) {
      res.status(500).json({
        status: "failure",
        message: "Account Record doesnt exist . Please login or signin",
      });
    }

    console.log(ClientOtpRecords);

    const { expiresAt, otp } = ClientOtpRecords[0];

    // if (expiresAt < Date.now()) {
    //   await otpVerificationModel.deleteMany({ entityId: ClientId });
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

    await clientModel.updateOne({ _id: ClientId }, { verified: true });
    // await otpVerificationModel.deleteMany({ _id: ClientId });
    return res.status(200).json({
      status: "success",
      message: "Client is verified",
    });
  } catch (error) {
    console.log(error);
  }
};

const resendOtpHandler = async (req, res) => {
  try {
    const { _id, email } = req.body.client;

    await otpVerificationModel.deleteMany({ entityId: _id });
    const data = await sendOtpVerificationEmail(email, _id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {}
};

const sendResetClientPasswordEmailHandler = async (req, res) => {
  try {
    const Client = req.Client;
    const redirectUrl = req.body.redirectUrl;

    if (!Client.verified) {
      console.log(error);
      res.status(500).json({ status: "failure", message: "Client not verified" });
    }

    const newPasswordReturn = await sendResetEmail(Client, redirectUrl);
    res.status(200).json({
      status: "Pending",
      message: "Resend Link sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failure", message: "couldnt reset password" });
  }
};

const resetClientPasswordHandler = async (req, res) => {
  try {
    const ClientId = req.Client._id;
    const { resetSequence, newPassword } = req.body;

    const resetPasswordObject = await resetPasswordModel.find({ entityId: ClientId });

    if (!resetPasswordObject.length > 0) {
      return res
        .status(500)
        .json({ status: "failure", message: "Password Request not found" });
    }

    if (resetPasswordObject[0].expiresAt < Date.now()) {
      resetPasswordModel.deleteOne({ entityId: ClientId });
      return res.status(500).json({ status: "failure", message: "Password Request expired" });
    }

    const hashedResetSequence = resetPasswordObject[0].resetString;
    const token = await compareHash(resetSequence, hashedResetSequence);
    console.log(token);

    if (!token) {
      return res.status(500).json({ status: "failure", message: "Invalid Token" });
    }

    const hashedNewPassword = await generateHash(newPassword);
    const updatedClient = await upsertClient(
      { _id: ClientId },
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedClient) {
      res.status(500).json({ status: "failure", message: "Password couldnt be changes" });
    }

    await resetPasswordModel.deleteOne({ entityId: ClientId });
    res.status(200).json({ status: "success", message: "Password was changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failure", message: "Problem in reseting password" });
  }
};

// testing controller

const resetClientVerification = async (req, res) => {};
module.exports = {
  clientSignupHandler,
  clientLoginHandler,
  verifyOtpHandler,
  resendOtpHandler,
  sendResetClientPasswordEmailHandler,
  resetClientPasswordHandler,
};
