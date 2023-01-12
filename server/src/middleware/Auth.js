const { adminModel } = require("../models/Admin");
const { clientModel } = require("../models/Client");
const { userModel } = require("../models/User");
const reIssueAccessToken = require("../services/Session");

const { verifyJwt } = require("../utils/Jwt");

const deserializeUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // console.log(header);

    const refreshToken = req.header["x-refresh"];
    if (!header) {
      res.status(401).json({ status: "failure", message: "Unauthorized request" });
    }

    const token = header.split("Bearer ")[1];

    const { decoded, expired } = verifyJwt(token);

    const user = await userModel.findOne({ _id: decoded.userId });

    // console.log(user);

    if (!user) {
      res
        .status(500)
        .json({ status: "failure", message: "No user present while checking token" });
    }

    if (decoded) {
      req.user = user;
      return next();
    }

    if (expired && refreshToken) {
      const accessToken = await reIssueAccessToken(refreshToken);

      if (accessToken) {
        res.setHeader("x-access-token", accessToken);
      }

      const result = verifyJwt(accessToken);
      res.user = result.decoded;
      next();
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

const deserializeClient = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // console.log(header);

    const refreshToken = req.header["x-refresh"];
    if (!header) {
      res.status(401).json({ status: "failure", message: "Unauthorized request" });
    }

    const token = header.split("Bearer ")[1];

    const { decoded, expired } = verifyJwt(token);

    const user = await clientModel.findOne({ _id: decoded.userId });

    // console.log(user);

    if (!user) {
      res
        .status(500)
        .json({ status: "failure", message: "No user present while checking token" });
    }

    if (decoded) {
      req.user = user;
      return next();
    }

    if (expired && refreshToken) {
      const accessToken = await reIssueAccessToken(refreshToken);

      if (accessToken) {
        res.setHeader("x-access-token", accessToken);
      }

      const result = verifyJwt(accessToken);
      res.user = result.decoded;
      next();
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

const deserializeAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // console.log(header);

    // const refreshToken = req.header["x-refresh"];
    if (!header) {
      res.status(401).json({ status: "failure", message: "Unauthorized request" });
    }

    const token = header.split("Bearer ")[1];

    const { decoded, expired } = verifyJwt(token);

    console.log(decoded);
    const user = await adminModel.findOne({ _id: decoded.Admin });

    // console.log(user);

    if (!user) {
      return res
        .status(500)
        .json({ status: "failure", message: "No user present while checking token" });
    }

    if (decoded) {
      req.user = user;
      return next();
    }

    // if (expired && refreshToken) {
    //   const accessToken = await reIssueAccessToken(refreshToken);

    //   if (accessToken) {
    //     res.setHeader("x-access-token", accessToken);
    //   }

    //   const result = verifyJwt(accessToken);
    //   res.user = result.decoded;
    //   next();
    // }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  deserializeUser,
  deserializeClient,
  deserializeAdmin,
};
