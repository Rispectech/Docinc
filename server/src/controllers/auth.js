const jwt = require("jsonwebtoken");

const { getGoogleOauthToken, getGoogleUser } = require("../services/auth");

const googleOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;
    const { access_token, token_id } = await getGoogleOauthToken(code);

    const googleUser = getGoogleUser(token_id, access_token);
    // const googleUser = jwt.decode(token.id_token);
    console.log(googleUser);
  } catch (error) {
    console.log(error.response);
  }
};

module.exports = {
  googleOauthHandler,
};
