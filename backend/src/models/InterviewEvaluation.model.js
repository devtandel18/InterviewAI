import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },
    perAnswer: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        correctness: { type: Number, min: 0, max: 100 },
        technicalDepth: { type: Number, min: 0, max: 100 },
        clarity: { type: Number, min: 0, max: 100 },
        notes: { type: String, trim: true },
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const InterviewEvaluation = mongoose.model("InterviewEvaluation", evaluationSchema);