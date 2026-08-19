import asyncHandler from "express-async-handler";
import {
  requestPasswordReset,
  resetPassword,
} from "../services/passwordReset.service.js";
// import passwordResetService from "../services/passwordReset.service.js";

export const requestReset = asyncHandler(async (req, res) => {
  const { token } = await passwordResetService.requestPasswordReset(req.body.email);

  res.status(200).json({
    success: true,
    message: "If an account exists for this email, a reset link has been generated.",
    // Remove `devToken` once a real email service is wired in —
    // it's only here so the reset flow is testable without one.
    devToken: token || undefined,
  });
});

export const confirmReset = asyncHandler(async (req, res) => {
  await passwordResetService.resetPassword(req.body.token, req.body.newPassword);
  res.status(200).json({ success: true, message: "Password has been reset." });
});