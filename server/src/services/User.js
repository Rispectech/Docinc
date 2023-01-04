const bcrypt = require("bcrypt");
const uuidv4 = require("uuidv4");
const { userModel } = require("../models/User");
const { CreateErrorClass } = require("../utils/error");
const { sendEmail } = require("./Mail");

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

const upsertGoogleUser = async (query, body, options) => {
  return await userModel.findByIdAndUpdate(query, body, options);
};

const sendResetEmail = (user, redirectUrl) => {
  const redirectSequence = uuidv4();
  try {
    sendEmail(
      user.email,
      "Password Reset",
      `<p>We heard that you lost your password</p> 
      <p> Dont worry , use the link below to reset it </p>
      <p> <a href = ${redirectUrl + "/" + _id + "/" + redirectSequence}</p>
      <p>This otp will expire after an hour</p>
      `
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  upsertGoogleUser,
  createUser,
  validateUserPassword,
  findUser,
};
