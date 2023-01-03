const jwt = require("jsonwebtoken");

const { getGoogleOauthToken, getGoogleUser } = require("../services/auth");
const { upsertGoogleUser } = require("../services/User");

const googleOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;
    const { access_token, token_id } = await getGoogleOauthToken(code);

    const googleUser = getGoogleUser(token_id, access_token);
    // const googleUser = jwt.decode(token.id_token);

    if (!googleUser.verified_email) {
      res.status(500).json({ status: "failure", message: "User Email is not verified" });
    }
    console.log(googleUser);

    const upsertedUser = upsertGoogleUser(
      { email: googleUser.email },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error.response);
  }
};

module.exports = {
  googleOauthHandler,
};
