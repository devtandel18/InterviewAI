import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

const EDITABLE_FIELDS = [
  "name",
  "profilePicture",
  "targetRole",
  "experienceLevel",
  "skills",
  "githubUrl",
  "linkedinUrl",
];

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user.toSafeObject();
}

export async function updateProfile(userId, updates) {
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (updates[field] !== undefined) payload[field] = updates[field];
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) throw ApiError.notFound("User not found");
  return user.toSafeObject();
}