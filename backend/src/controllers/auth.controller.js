import asyncHandler from "express-async-handler";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, targetRole } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password, targetRole });

  res.status(201).json({ success: true, data: { user, token } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  res.status(200).json({ success: true, data: { user, token } });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  res.status(200).json({ success: true, data: { user } });
});