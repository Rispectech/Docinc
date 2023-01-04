const nodeMailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { OtpVerificationModel } = require("../models/VerifiedOtp");

const sendEmail = async (email, subject, html) => {
  const transporter = nodeMailer.createTransport({
    // host: "smtp-mail.outlook.com", // hostname
    service: "gmail",
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  let mailOptions = {
    from: process.env.AUTH_USER, // sender address
    to: email, // list of receivers
    subject: subject, // Subject
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

const sendOtpVerificationEmail = async (email, _id) => {
  const transporter = nodeMailer.createTransport({
    // host: "smtp-mail.outlook.com", // hostname
    service: "gmail",
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    let mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: email, // list of receivers
      subject: "Verify Your Account", // Subject
      html: ` <p>Enter ${otp} in the application to verify the email and complete registration </p>
      <p>This otp will expire after an hour</p>
      `,
    };
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const newOtp = await OtpVerificationModel.create({
      entity_id: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now(Date.now() * 3600000),
    });

    await transporter.sendMail(mailOptions);

    return {
      status: "Pending",
      message: "Verification Otp email sent",
      data: {
        userId: _id,
        email,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendOtpVerificationEmail,
  sendEmail,
};
