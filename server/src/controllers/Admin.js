const bcrypt = require("bcrypt");
const { adminModel } = require("../models/Admin");

const { otpVerificationModel } = require("../models/VerifiedOtp");
const { sendOtpVerificationEmail } = require("../utils/Mail");
const { createSession } = require("../services/Session");
const {
  createAdmin,
  findAdmin,
  sendResetEmail,
  validateAdminPassword,
  upsertAdmin,
  reIssueAccessToken,
} = require("../services/Admin");
const { CreateErrorClass } = require("../utils/error");
const { signJwt, verifyJwt } = require("../utils/Jwt");
const { resetPasswordModel } = require("../models/ResetPassword");
const { compareHash, generateHash } = require("../utils/bycrpt");
const { findAllClient } = require("../services/Client");

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

const adminSignupHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const db_Admin = await findAdmin({ email: body.email });

    if (db_Admin) {
      next(CreateErrorClass(500, "failure", "Admin already Present"));
    }
    const Admin = await createAdmin(body);

    const verifiedOtp = await sendOtpVerificationEmail(Admin.email, Admin._id);

    console.log(verifiedOtp);
    const Admin_obj = Admin.toObject();
    delete Admin_obj.password;
    // console.log(Admin_obj);
    res.status(200).json({ status: "success", data: Admin_obj });
  } catch (error) {
    console.log(error);
  }
};

const adminLoginHandler = async (req, res, next) => {
  try {
    const AdminBody = req.body;
    const Admin = await adminModel.findOne({ email: AdminBody.email });

    if (!Admin) return res.status(500).json({ status: "failure", message: "Invalid Email" });

    if (!AdminBody.password) {
      return next(CreateErrorClass(500, "failure", "Password is required"));
    }
    if (!validateAdminPassword(AdminBody.password, Admin))
      return res.status(500).json({ status: "failure", message: "Invalid Password" });

    const session = await createSession(Admin._id, req.get("Admin-agent") || "");

    console.log(session);

    const verifiedOtp = await sendOtpVerificationEmail(Admin.email, Admin._id);

    const accessToken = signJwt(
      {
        AdminId: Admin._id,
        session: session._id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = signJwt(
      {
        AdminId: Admin._id,
        session: session._id,
      },
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );

    // res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    const Admin_obj = Admin.toObject();
    delete Admin_obj.password;

    return res
      .status(200)
      .json({ status: "success", data: { accessToken, ...Admin_obj, refreshToken } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failure", message: "couldnt create session" });
  }
};

const verifyOtpHandler = async (req, res) => {
  try {
    // const AdminId = req.Admin._id;
    const AdminId = req.body.id;
    console.log(AdminId);
    const body_otp = req.body.otp;

    if (!AdminId && !body_otp) {
      return res.status(500).json({
        status: "failure",
        message: "Empty otp is not allowed",
      });
    }

    const AdminOtpRecords = await otpVerificationModel
      .find({ entityId: AdminId })
      .sort({ createdAt: -1 });
    if (AdminOtpRecords.length < 0) {
      return res.status(500).json({
        status: "failure",
        message: "Account Record doesnt exist . Please login or signin",
      });
    }

    console.log(AdminOtpRecords);

    const { expiresAt, otp } = AdminOtpRecords[0];

    if (expiresAt < Date.now()) {
      console.log("working");

      await otpVerificationModel.deleteMany({ entityId: AdminId });
      return res.status(500).json({
        status: "failure",
        message: "Code has expired . Please request again",
      });
    }

    console.log(body_otp, otp);

    const validOtp = await bcrypt.compare(body_otp, otp);

    console.log(validOtp);

    if (!validOtp) {
      return res.status(500).json({
        status: "failure",
        message: "Invalid OTP",
      });
    }

    await adminModel.updateOne({ _id: AdminId }, { verified: true });
    await otpVerificationModel.deleteMany({ _id: AdminId });
    return res.status(200).json({
      status: "success",
      message: "Admin is verified",
    });
  } catch (error) {
    console.log(error);
  }
};

const resendOtpHandler = async (req, res) => {
  try {
    const { _id, email } = req.body.Admin;

    await otpVerificationModel.deleteMany({ entityId: _id });
    const data = await sendOtpVerificationEmail(email, _id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {}
};

const sendResetAdminPasswordEmailHandler = async (req, res) => {
  try {
    const email = req.body.email;
    const redirectUrl = req.body.redirectUrl;

    const Admin = await findAdmin({ email });

    if (!Admin) {
      res.status(500).json({ status: "failure", message: "Admin not registered" });
    }
    // if (!Admin.verified) {
    //   console.log(error);
    //   res.status(500).json({ status: "failure", message: "Admin not verified" });
    // }

    console.log(Admin);

    const newPasswordReturn = await sendResetEmail(Admin, redirectUrl);
    res.status(200).json({
      status: "Pending",
      message: "Resend Link sent",
      data: Admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failure", message: "couldnt reset password" });
  }
};

const resetAdminPasswordHandler = async (req, res) => {
  try {
    const AdminId = req.body.id;
    const { resetSequence, newPassword } = req.body;

    const resetPasswordObject = await resetPasswordModel
      .find({ entityId: AdminId })
      .sort({ createdAt: -1 });

    // console.log(resetPasswordObject, resetPasswordObject[0].expiresAt < Date.now());

    if (!resetPasswordObject.length > 0) {
      return res
        .status(500)
        .json({ status: "failure", message: "Password Request not found" });
    }

    if (resetPasswordObject[0].expiresAt < Date.now()) {
      resetPasswordModel.deleteOne({ entityId: AdminId });
      return res.status(500).json({ status: "failure", message: "Password Request expired" });
    }

    const hashedResetSequence = resetPasswordObject[0].resetString;
    const token = await compareHash(resetSequence, hashedResetSequence);
    console.log(token);

    if (!token) {
      // console.log("working");
      // await resetPasswordModel.deleteOne({ entityId: AdminId });
      return res.status(500).json({ status: "failure", message: "Invalid Token" });
    }

    const hashedNewPassword = await generateHash(newPassword);
    const updatedAdmin = await upsertAdmin(
      { _id: AdminId },
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      res.status(500).json({ status: "failure", message: "Password couldnt be changed" });
    }

    // await resetPasswordModel.deleteOne({ entityId: AdminId });
    res.status(200).json({ status: "success", message: "Password was changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failure", message: "Problem in reseting password" });
  }
};

// testing controller
const refreshAdminAccessToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    const { decoded, expired } = verifyJwt(refreshToken);

    const Admin = adminModel.findOne({ _id: decoded });

    if (!Admin) {
      res.status(401).json({ status: "failure", message: "User doesn't exist" });
    }

    const accessToken = await reIssueAccessToken(refreshToken);
    res.status(200).json({
      status: "success",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllClient = async (req, res) => {
  try {
    const admin = req.user;

    const allClients = await findAllClient({});
    console.log(allClients);
    return res.status(200).json({ status: "success", data: allClients });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failure", message: "problem while getting clients" });
  }
};

module.exports = {
  adminSignupHandler,
  adminLoginHandler,
  verifyOtpHandler,
  resendOtpHandler,
  sendResetAdminPasswordEmailHandler,
  resetAdminPasswordHandler,
  refreshAdminAccessToken,
  getAllClient,
};
