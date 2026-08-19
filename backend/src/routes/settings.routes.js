import { Router } from "express";
import { body } from "express-validator";
import { updatePassword, updateSettings, deleteAccount } from "../controllers/settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.put(
  "/password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),
  ],
  validate,
  updatePassword
);

router.put(
  "/",
  protect,
  [
    body("theme").optional().isIn(["light", "dark", "system"]),
    body("notificationPreferences.email").optional().isBoolean(),
    body("notificationPreferences.interviewReminders").optional().isBoolean(),
  ],
  validate,
  updateSettings
);

router.delete("/account", protect, deleteAccount);

export default router;