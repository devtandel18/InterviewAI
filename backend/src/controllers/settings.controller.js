import asyncHandler from "express-async-handler";
import * as settingsService from "../services/settings.service.js";

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await settingsService.changePassword(req.user._id, currentPassword, newPassword);
  res.status(200).json({ success: true, message: "Password updated." });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const user = await settingsService.updateSettings(req.user._id, req.body);
  res.status(200).json({ success: true, data: { user } });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await settingsService.deleteAccount(req.user._id);
  res.status(200).json({ success: true, message: "Account deleted." });
});