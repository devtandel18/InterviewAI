import { Router } from "express";
import { body } from "express-validator";
import {
  createInterview,
  getInterview,
  getProgress,
  submitAnswer,
  completeInterview,
  getEvaluation,
} from "../controllers/interview.controller.js"; 
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { ROLE_VALUES, INTERVIEW_TYPE_VALUES, DIFFICULTY_VALUES } from "../models/Interview.model.js";

const router = Router();

router.post(
  "/",
  protect,
  [
    body("role").isIn(ROLE_VALUES).withMessage(`Role must be one of: ${ROLE_VALUES.join(", ")}`),
    body("interviewType")
      .isIn(INTERVIEW_TYPE_VALUES)
      .withMessage(`Interview type must be one of: ${INTERVIEW_TYPE_VALUES.join(", ")}`),
    body("difficulty")
      .isIn(DIFFICULTY_VALUES)
      .withMessage(`Difficulty must be one of: ${DIFFICULTY_VALUES.join(", ")}`),
    body("numQuestions").isIn([5, 10, 15]).withMessage("Number of questions must be 5, 10, or 15"),
    body("durationMinutes")
      .isIn([15, 30, 45])
      .withMessage("Duration must be 15, 30, or 45 minutes"),
  ],
  validate,
  createInterview
);
router.get("/", protect, getInterview);
router.get("/:id", protect, getInterview);
router.get("/:id/progress", protect, getProgress);

router.post(
  "/:id/answers",
  protect,
  [
    body("questionId").isMongoId().withMessage("Valid questionId is required"),
    body("content").optional().isString(),
    body("skipped").optional().isBoolean(),
  ],
  validate,
  submitAnswer
);


router.post("/:id/complete", protect, completeInterview);
router.get("/:id/evaluation", protect, getEvaluation);

export default router;