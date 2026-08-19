import { Router } from "express";
import { body } from "express-validator";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/", protect, getMyProfile);

router.put(
  "/",
  protect,
  [
    body("name").optional().trim().notEmpty(),
    body("skills").optional().isArray(),
    body("githubUrl").optional({ checkFalsy: true }).isURL().withMessage("Must be a valid URL"),
    body("linkedinUrl").optional({ checkFalsy: true }).isURL().withMessage("Must be a valid URL"),
  ],
  validate,
  updateMyProfile
);

export default router;