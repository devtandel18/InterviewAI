import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select("+password");
  if (!user) throw ApiError.notFound("User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.unauthorized("Current password is incorrect");

  user.password = newPassword;
  await user.save();

  return { success: true };
}

export async function updateSettings(userId, { theme, notificationPreferences }) {
  const payload = {};
  if (theme) payload.theme = theme;
  if (notificationPreferences) payload.notificationPreferences = notificationPreferences;

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) throw ApiError.notFound("User not found");
  return user.toSafeObject();
}

export async function deleteAccount(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw ApiError.notFound("User not found");
  return { success: true };
}