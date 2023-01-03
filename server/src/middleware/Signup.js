const { CreateErrorClass } = require("../utils/error");

var emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
  if (!email) return false;

  if (email.length > 254) return false;

  var valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  var parts = email.split("@");
  if (parts[0].length > 64) return false;

  var domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
}

const checkSignup = async (req, res, next) => {
  try {
    // console.log(req.body);
    const body = req.body;
    if (!isEmailValid(body.email)) {
      //   res.status(500).json({ status: "failure", message: "Email not valid" });
      return next(CreateErrorClass(500, "failure", "Email not valid"));
    }

    if (body.password !== body.passwordConfirmation) {
      //   res.status(500).json({ status: "failure", message: "" });
      return next(CreateErrorClass(500, "failure", "Password dont match"));
    }
    req.body = body;

    next();
  } catch (error) {
    return next();
  }
};

module.exports = {
  checkSignup,
};
