import mongoose from "mongoose";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
];

const INTERVIEW_TYPES = ["Technical", "Behavioral", "System Design", "Mixed"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["in_progress", "completed", "abandoned"];

const scoreBreakdownSchema = new mongoose.Schema(
  {
    technicalKnowledge: { type: Number, min: 0, max: 100 },
    problemSolving: { type: Number, min: 0, max: 100 },
    communication: { type: Number, min: 0, max: 100 },
    systemDesign: { type: Number, min: 0, max: 100 },
    overall: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, enum: ROLES, required: true },
    interviewType: { type: String, enum: INTERVIEW_TYPES, required: true },
    difficulty: { type: String, enum: DIFFICULTIES, required: true },
    numQuestions: { type: Number, required: true, min: 1 },
    durationMinutes: { type: Number, required: true },

    status: { type: String, enum: STATUSES, default: "in_progress" },
    questionsAnswered: { type: Number, default: 0 },

    scores: { type: scoreBreakdownSchema, default: undefined },

    strengths: [{ type: String, trim: true }],
    improvements: [{ type: String, trim: true }],
    recommendedTopics: [{ type: String, trim: true }],
    aiSummary: { type: String, trim: true },

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });

export const ROLE_VALUES = ROLES;
export const INTERVIEW_TYPE_VALUES = INTERVIEW_TYPES;
export const DIFFICULTY_VALUES = DIFFICULTIES;
export const Interview = mongoose.model("Interview", interviewSchema);