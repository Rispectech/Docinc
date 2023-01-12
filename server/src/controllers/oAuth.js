const jwt = require("jsonwebtoken");
const { upsertAdmin } = require("../services/Admin");
const { upsertClient } = require("../services/Client");

const { getGoogleOauthToken, getGoogleUser } = require("../services/oAuth");
const { upsertUser } = require("../services/User");

const accessTokenCookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

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

    const user = upsertUser(
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

    const session = createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );

    return res.status(200).json({ status: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    console.log(error.response);
  }
};

const googleClientOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;
    const { access_token, token_id } = await getGoogleOauthToken(code);

    const googleUser = await getGoogleUser(token_id, access_token);
    // const googleUser = jwt.decode(token.id_token);

    // if (!googleUser.verified_email) {
    //   return res
    //     .status(500)
    //     .json({ status: "failure", message: "User Email is not verified" });
    // }

    console.log(googleUser);

    const user = await upsertClient(
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

    console.log("user", user);

    const session = createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );

    return res.status(200).json({ status: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    console.log(error.response);
  }
};

const googleAdminOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;
    const { access_token, token_id } = await getGoogleOauthToken(code);

    const googleUser = getGoogleUser(token_id, access_token);
    // const googleUser = jwt.decode(token.id_token);

    if (!googleUser.verified_email) {
      res.status(500).json({ status: "failure", message: "User Email is not verified" });
    }
    console.log(googleUser);

    const user = upsertAdmin(
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

    const session = createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = signJwt(
      {
        userId: user._id,
        session: session._id,
      },
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );

    return res.status(200).json({ status: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    console.log(error.response);
  }
};

module.exports = {
  googleOauthHandler,
  googleClientOauthHandler,
};
