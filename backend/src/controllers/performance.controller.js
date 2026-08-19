import asyncHandler from "express-async-handler";
import * as performanceService from "../services/performance.service.js";

export const getPerformance = asyncHandler(async (req, res) => {
  const data = await performanceService.getPerformanceAnalytics(req.user._id);
  res.status(200).json({ success: true, data });
});