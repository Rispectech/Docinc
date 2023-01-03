const jwt = require("jsonwebtoken");

const signJwt = (object, options) => {
  return jwt.sign(object, process.env.JWT_SECRET_KEY, {
    ...(options && options),
  });
};

const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
