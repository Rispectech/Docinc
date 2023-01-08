const { sessionModel } = require("../models/Session");
const { verifyJwt } = require("../utils/Jwt");

const createSession = async (userId, userAgent) => {
  return await sessionModel.create({ entity: userId, userAgent });
};

const findSession = async (query) => {
  return await sessionModel.find(query);
};

const updateSession = async (query, update) => {
  return await sessionModel.updateOne(query, update);
};

module.exports = {
  createSession,
  findSession,
  updateSession,
};
