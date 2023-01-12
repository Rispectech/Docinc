const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
var fs = require("fs");

const { resetPasswordModel } = require("../models/ResetPassword");
const { clientModel } = require("../models/Client");
const { CreateErrorClass } = require("../utils/error");
const { sendEmail, getHrTime } = require("../utils/Mail");
const { verifyJwt, signJwt } = require("../utils/Jwt");
const { sessionModel } = require("../models/Session");

const makeDir = (id) => {
  var dir = `${__dirname}/../../../${id}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const findClient = async (query) => {
  return await clientModel.findOne(query);
};

const findAllClient = async (query) => {
  return await clientModel.find(query);
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
      Client.companyEmail,
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

const reIssueAccessToken = async (refreshToken) => {
  const decoded = verifyJwt(refreshToken);

  if (!decoded && !decoded._id) return false;

  // console.log(decoded);

  const session = await sessionModel.findOne({ _id: decoded.decoded.session });

  // console.log(session);

  if (!session || !session.valid) return false;
  // console.log(session);
  const client = await findClient({ _id: session.entity });

  if (!client) return false;

  const accessToken = signJwt(
    { client: client._id, session: session._id },
    { expiresIn: "2h" } // 15 minutes
  );

  return accessToken;
};

module.exports = {
  upsertClient,
  createClient,
  validateClientPassword,
  findClient,
  sendResetEmail,
  reIssueAccessToken,
  makeDir,
  findAllClient,
};
