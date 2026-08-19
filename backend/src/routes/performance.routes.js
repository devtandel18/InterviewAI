import { Router } from "express";
import { getPerformance } from "../controllers/performance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getPerformance);

export default router;