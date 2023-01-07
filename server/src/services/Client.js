const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const { resetPasswordModel } = require("../models/ResetPassword");
const { clientModel } = require("../models/Client");
const { CreateErrorClass } = require("../utils/error");
const { sendEmail, getHrTime } = require("../utils/Mail");

const findClient = async (query) => {
  return await clientModel.findOne(query);
};

const createClient = async (ClientBody) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(ClientBody.password, salt);
  return await clientModel.create({ ...ClientBody, password: hash });
};

const validateClientPassword = (password, Client) => {
  const checkPassword = bcrypt.compareSync(password, Client.password);
  return checkPassword;
};

const upsertClient = async (query, body, options) => {
  return await clientModel.findByIdAndUpdate(query, body, options);
};

const sendResetEmail = async (Client, redirectUrl) => {
  const redirectSequence = v4();
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(redirectSequence, saltRounds);
    const newPasswordReset = await resetPasswordModel.create({
      entityId: Client._id,
      resetString: hash,
      createdAt: Date.now(),
      expiresAt: getHrTime(),
    });

    await sendEmail(
      Client.email,
      "Password Reset",
      `<p>We heard that you lost your password</p> 
      <p> Dont worry , use the link below to reset it </p>
      <p>  Press <a href = ${
        redirectUrl + "/" + Client._id + "/" + redirectSequence
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
  upsertClient,
  createClient,
  validateClientPassword,
  findClient,
  sendResetEmail,
};
