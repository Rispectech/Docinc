const { sessionModel } = require("../models/Session");
const { verifyJwt } = require("../utils/Jwt");

const createSession = async (userId, userAgent) => {
  const session = await sessionModel.create({ userId, userAgent });
  return session.toJSON();
};

const findSession = async (query) => {
  return await sessionModel.find(query);
};

const updateSession = async (query, update) => {
  return await sessionModel.updateOne(query, update);
};

const reIssueAccessToken = async (refreshToken) => {
  const decoded = verifyJwt(refreshToken);

  if (!decoded && !decoded._id) return false;

  const session = await sessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
};

module.exports = {
  createSession,
  findSession,
  updateSession,
  reIssueAccessToken,
};
