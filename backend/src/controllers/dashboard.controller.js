import asyncHandler from "express-async-handler";
import * as dashboardService from "../services/dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardStats(req.user._id);
  res.status(200).json({ success: true, data });
});