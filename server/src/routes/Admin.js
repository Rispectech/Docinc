const express = require("express");
const { getSessionHandler, deleteSessionHandler } = require("../controllers/Session");
const {
  verifyOtpHandler,
  resendOtpHandler,
  adminSignupHandler,
  adminLoginHandler,
  sendResetAdminPasswordEmailHandler,
  resetAdminPasswordHandler,
  refreshAdminAccessToken,
  getAllClient,
  deleteClientHandler,
  updateClientHandler,
} = require("../controllers/Admin");
const { deserializeAdmin } = require("../middleware/Auth");
const { checkSignup } = require("../middleware/Signup");
const adminRouter = express.Router();

adminRouter.route("/api/admin/register").post(checkSignup, adminSignupHandler);
adminRouter.route("/api/admin/login").post(adminLoginHandler);
adminRouter.route("/api/sessions").get(deserializeAdmin, getSessionHandler);
adminRouter.route("/api/admin/logout").delete(deserializeAdmin, deleteSessionHandler);
adminRouter.route("/api/admin/verifyOtp").post(verifyOtpHandler);
adminRouter.route("/api/admin/resendOtp").get(resendOtpHandler);
adminRouter.route("/api/admin/requestPasswordReset").post(sendResetAdminPasswordEmailHandler);
adminRouter.route("/api/admin/resetPassword").post(resetAdminPasswordHandler);
adminRouter.route("/api/admin/refreshAccessToken").post(refreshAdminAccessToken);

adminRouter.route("/api/admin/getAllClients").get(deserializeAdmin, getAllClient);
adminRouter.route("/api/admin/deleteClient").delete(deserializeAdmin, deleteClientHandler);
adminRouter.route("/api/admin/updateClient").post(deserializeAdmin, updateClientHandler);
module.exports = {
  adminRouter,
};
