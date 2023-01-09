const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const { resetPasswordModel } = require("../models/ResetPassword");
const { adminModel } = require("../models/Admin");
const { CreateErrorClass } = require("../utils/error");
const { sendEmail, getHrTime } = require("../utils/Mail");
const { verifyJwt, signJwt } = require("../utils/Jwt");
const { sessionModel } = require("../models/Session");

const findAdmin = async (query) => {
  return await adminModel.findOne(query);
};

const createAdmin = async (AdminBody) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(AdminBody.password, salt);
  return await adminModel.create({ ...AdminBody, password: hash });
};

const validateAdminPassword = (password, Admin) => {
  const checkPassword = bcrypt.compareSync(password, Admin.password);
  return checkPassword;
};

const upsertAdmin = async (query, body, options) => {
  return await adminModel.findByIdAndUpdate(query, body, options);
};

const sendResetEmail = async (Admin, redirectUrl) => {
  const redirectSequence = v4();
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(redirectSequence, saltRounds);
    const newPasswordReset = await resetPasswordModel.create({
      entityId: Admin._id,
      resetString: hash,
      createdAt: Date.now(),
      expiresAt: getHrTime(),
    });

    await sendEmail(
      Admin.email,
      "Password Reset",
      `<p>We heard that you lost your password</p> 
      <p> Dont worry , use the link below to reset it </p>
      <p>  Press <a href = ${
        redirectUrl + "/" + Admin._id + "/" + redirectSequence
      }> here</a> to proceed</p>
      <p>This otp will expire after an hour</p>
      `
    );

    return newPasswordReset;
  } catch (error) {
    console.log(error);
  }
};

const reIssueAccessToken = async (refreshToken) => {
  const decoded = verifyJwt(refreshToken);

  if (!decoded && !decoded._id) return false;

  // console.log(decoded);

  const session = await sessionModel.findOne({ _id: decoded.decoded.session });

  // console.log(session);

  if (!session || !session.valid) return false;
  // console.log(session);
  const Admin = await findAdmin({ _id: session.entity });

  if (!Admin) return false;

  const accessToken = signJwt(
    { Admin: Admin._id, session: session._id },
    { expiresIn: "2h" } // 15 minutes
  );

  return accessToken;
};

module.exports = {
  upsertAdmin,
  createAdmin,
  validateAdminPassword,
  findAdmin,
  sendResetEmail,
  reIssueAccessToken,
};
