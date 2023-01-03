const userModel = require("../models/User");
const reIssueAccessToken = require("../services/Session");

const { verifyJwt } = require("../utils/Jwt");

const deserializeUser = async (req, res, next) => {
  try {
    const header = req.headers.authentication;

    const refreshToken = req.header["x-refresh"];
    if (!header) {
      res.status(401).json({ status: "failure", message: "Unauthorized request" });
    }

    const token = header.split("Bearer ")[1];

    const { decoded, expired } = verifyJwt(token);

    const user = userModel.findOne({ _id: decoded });

    if (!user) {
      res
        .status(500)
        .json({ status: "failure", message: "No user present while checking token" });
    }
    if (decoded) {
      res.local.user = user;
      return next();
    }

    if (expired && refreshToken) {
      const accessToken = await reIssueAccessToken(refreshToken);

      if (accessToken) {
        res.setHeader("x-access-token", accessToken);
      }

      const result = await verifyJwt(accessToken);
      res.locals.user = result.decoded;
      next();
    }

    next();
  } catch (error) {}
};

module.exports = {
  deserializeUser,
};
