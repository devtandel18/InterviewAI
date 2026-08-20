import asyncHandler from "express-async-handler";
import * as profileService from "../services/profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.user._id);
  res.status(200).json({ success: true, data: { user } });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updateProfile(req.user._id, req.body);
  res.status(200).json({ success: true, data: { user } });
});

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest("No file uploaded");
  }

  const url = `/uploads/avatars/${req.file.filename}`;
  const user = await profileService.updateProfile(req.user._id, { profilePicture: url });

  res.status(200).json({ success: true, data: { user } });
});