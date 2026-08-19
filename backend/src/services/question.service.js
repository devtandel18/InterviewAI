import { env } from "../config/env.js";
import { Question } from "../models/Question.model.js";
import * as openaiProvider from "./llm/openaiProvider.js";

// ...FALLBACK_BANK and pickQuestions stay exactly as before...

export async function generateQuestionsForInterview(interview) {
  let prompts;

  if (env.llm.provider === "openai") {
    try {
      prompts = await openaiProvider.generateQuestions({
        interviewType: interview.interviewType,
        role: interview.role,
        difficulty: interview.difficulty,
        count: interview.numQuestions,
      });
    } catch (err) {
      // If the LLM call fails (bad key, rate limit, network issue),
      // fall back rather than leaving the user with a broken session.
      console.error("[llm] Question generation failed, using fallback:", err.message);
      prompts = pickQuestions(interview.interviewType, interview.numQuestions);
    }
  } else {
    prompts = pickQuestions(interview.interviewType, interview.numQuestions);
  }

  const questions = await Question.insertMany(
    prompts.map((prompt, i) => ({
      interview: interview._id,
      order: i + 1,
      prompt,
      category: interview.interviewType,
    }))
  );

  return questions;
}