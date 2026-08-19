import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    order: { type: Number, required: true },
    prompt: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
  },
  { timestamps: true }
);

questionSchema.index({ interview: 1, order: 1 }, { unique: true });

export const Question = mongoose.model("Question", questionSchema);