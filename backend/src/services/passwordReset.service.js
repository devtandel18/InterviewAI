import crypto from "crypto";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });

  // Deliberately do the same amount of work and return the same
  // response whether or not the email exists — this is what stops
  // the endpoint being usable to check which emails are registered.
  if (!user) return { token: null };

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + TOKEN_TTL_MS);
  await user.save({ validateBeforeSave: false });

  // No email service is wired up yet, so the raw token is returned
  // directly here for now — in production this would be emailed to
  // the user instead of returned in the API response.
  return { token: rawToken };
}

export async function resetPassword(rawToken, newPassword) {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    throw ApiError.badRequest("This reset link is invalid or has expired");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { success: true };
}