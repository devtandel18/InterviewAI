import { Router } from "express";
import { body } from "express-validator";
import { requestReset, confirmReset } from "../controllers/passwordReset.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required").normalizeEmail()],
  validate,
  requestReset
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  validate,
  confirmReset
);

export default router;