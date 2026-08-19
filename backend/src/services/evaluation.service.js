import { env } from "../config/env.js";
import { Question } from "../models/Question.model.js";
import { Answer } from "../models/Answer.model.js";
import { Interview } from "../models/Interview.model.js";
import { InterviewEvaluation } from "../models/InterviewEvaluation.model.js";
import * as openaiProvider from "./llm/openaiProvider.js";

// ...IMPROVEMENT_LIBRARY, scoreAnswerFallback, average stay exactly as before...

async function scoreAnswerReal(question, answer) {
  if (answer.skipped || !answer.content?.trim()) {
    return { correctness: 0, technicalDepth: 0, clarity: 0, notes: "Skipped or left blank." };
  }
  try {
    return await openaiProvider.scoreAnswer({ question: question.prompt, answer: answer.content });
  } catch (err) {
    console.error("[llm] Scoring failed, using fallback:", err.message);
    return scoreAnswerFallback(answer);
  }
}

export async function evaluateInterview(interviewId) {
  const interview = await Interview.findById(interviewId);
  const questions = await Question.find({ interview: interviewId }).sort({ order: 1 });
  const answers = await Answer.find({ interview: interviewId });

  const answerByQuestion = new Map(answers.map((a) => [a.question.toString(), a]));

  const perAnswer = [];
  for (const q of questions) {
    const answer = answerByQuestion.get(q._id.toString()) || { skipped: true, content: "" };
    const scored =
      env.llm.provider === "openai" ? await scoreAnswerReal(q, answer) : scoreAnswerFallback(answer);
    perAnswer.push({ question: q._id, ...scored });
  }

  // ...everything from here down (InterviewEvaluation.create, score aggregation,
  // strengths/improvements/recommendedTopics/aiSummary, Interview.findByIdAndUpdate)
  // is completely unchanged from before...
}