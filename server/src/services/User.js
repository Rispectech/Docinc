const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const { resetPasswordModel } = require("../models/ResetPassword");
const { userModel } = require("../models/User");
const { CreateErrorClass } = require("../utils/error");
const { sendEmail, getHrTime } = require("../utils/Mail");

const findUser = async (query) => {
  return await userModel.findOne(query);
};

const createUser = async (userBody) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userBody.password, salt);
  return await userModel.create({ ...userBody, password: hash });
};

const validateUserPassword = (password, user) => {
  const checkPassword = bcrypt.compareSync(password, user.password);
  return checkPassword;
};

const upsertUser = async (query, body, options) => {
  return await userModel.findByIdAndUpdate(query, body, options);
};

const sendResetEmail = async (user, redirectUrl) => {
  const redirectSequence = v4();
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(redirectSequence, saltRounds);
    const newPasswordReset = await resetPasswordModel.create({
      entityId: user._id,
      resetString: hash,
      createdAt: Date.now(),
      expiresAt: getHrTime(),
    });

    await sendEmail(
      user.email,
      "Password Reset",
      `<p>We heard that you lost your password</p> 
      <p> Dont worry , use the link below to reset it </p>
      <p>  Press <a href = ${
        redirectUrl + "/" + user._id + "/" + redirectSequence
      }> here</a> to proceed</p>
      <p>This otp will expire after an hour</p>
      `
    );

    return newPasswordReset;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  upsertUser,
  createUser,
  validateUserPassword,
  findUser,
  sendResetEmail,
};
