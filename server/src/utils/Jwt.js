const jwt = require("jsonwebtoken");

const signJwt = async (object, options) => {
  return jwt.sign(object, process.env.PRIVAT_KEY, {
    ...(options && options),
    algorithm: "RS256",
  });
};

const verifyJwt = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY);
    return {
      verify: true,
      decoded,
      expired: false,
    };
  } catch (error) {
    console.log(error);
    return {
      verify: false,
      decoded: false,
      expired: error.message === "jwt expired",
    };
  }
};

module.exports = {
  signJwt,
  verifyJwt,
};
