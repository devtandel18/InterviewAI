import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    content: { type: String, trim: true, default: "" },
    skipped: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

answerSchema.index({ interview: 1, question: 1 }, { unique: true });

export const Answer = mongoose.model("Answer", answerSchema);