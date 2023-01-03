const bcrypt = require("bcrypt");
const { userModel } = require("../models/User");
const { CreateErrorClass } = require("../utils/error");

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

module.exports = {
  upsertGoogleUser,
  createUser,
  validateUserPassword,
  findUser,
};
