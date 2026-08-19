import { Interview } from "../models/Interview.model.js";
import { Question } from "../models/Question.model.js";
import { Answer } from "../models/Answer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateQuestionsForInterview } from "./question.service.js";
import { evaluateInterview } from "./evaluation.service.js";

export async function createInterview(userId, { role, interviewType, difficulty, numQuestions, durationMinutes }) {
  const interview = await Interview.create({
    user: userId,
    role,
    interviewType,
    difficulty,
    numQuestions,
    durationMinutes,
    status: "in_progress",
  });

  await generateQuestionsForInterview(interview);

  return interview.toObject();
}

export async function getInterviewById(userId, interviewId) {
  const interview = await Interview.findOne({ _id: interviewId, user: userId }).lean();
  if (!interview) {
    throw ApiError.notFound("Interview not found");
  }
  return interview;
}

export async function getInterviewProgress(userId, interviewId) {
  const interview = await getInterviewById(userId, interviewId);

  const questions = await Question.find({ interview: interviewId }).sort({ order: 1 }).lean();
  const answers = await Answer.find({ interview: interviewId }).lean();
  const answeredQuestionIds = new Set(answers.map((a) => a.question.toString()));

  const nextQuestion = questions.find((q) => !answeredQuestionIds.has(q._id.toString()));

  return {
    interview,
    totalQuestions: questions.length,
    answeredCount: answers.length,
    currentQuestion: nextQuestion || null,
    isComplete: !nextQuestion,
  };
}

export async function submitAnswer(userId, interviewId, questionId, { content, skipped = false }) {
  const interview = await getInterviewById(userId, interviewId);

  if (interview.status !== "in_progress") {
    throw ApiError.badRequest("This interview is no longer in progress");
  }

  const question = await Question.findOne({ _id: questionId, interview: interviewId });
  if (!question) {
    throw ApiError.notFound("Question not found for this interview");
  }

  const existing = await Answer.findOne({ interview: interviewId, question: questionId });
  if (existing) {
    throw ApiError.conflict("This question has already been answered");
  }

  await Answer.create({ interview: interviewId, question: questionId, content, skipped });
  await Interview.updateOne({ _id: interviewId }, { $inc: { questionsAnswered: 1 } });

  return getInterviewProgress(userId, interviewId);
}

export async function completeInterview(userId, interviewId) {
  const interview = await getInterviewById(userId, interviewId);

  if (interview.status === "completed") {
    return interview;
  }

  await Interview.findByIdAndUpdate(interviewId, {
    status: "completed",
    completedAt: new Date(),
  });

  // Evaluation runs synchronously for now. Once BullMQ is introduced
  // (per the deferred future-architecture plan), this becomes a
  // queued job instead — the interview would flip to "completed"
  // immediately while evaluation happens in the background, and the
  // Results page would poll or receive a WebSocket event when ready.
  const evaluated = await evaluateInterview(interviewId);

  return evaluated;
}

export async function getEvaluationForInterview(userId, interviewId) {
  const interview = await getInterviewById(userId, interviewId);

  if (interview.status !== "completed") {
    throw ApiError.badRequest("This interview hasn't been completed yet");
  }

  return interview;
}

export async function listInterviews(userId, { search, role, interviewType, difficulty, status, sortBy = "createdAt", order = "desc" }) {
  const query = { user: userId };

  if (role) query.role = role;
  if (interviewType) query.interviewType = interviewType;
  if (difficulty) query.difficulty = difficulty;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { role: { $regex: search, $options: "i" } },
      { interviewType: { $regex: search, $options: "i" } },
    ];
  }

  const sortField = ["createdAt", "score"].includes(sortBy) ? sortBy : "createdAt";
  const sortPath = sortField === "score" ? "scores.overall" : "createdAt";

  const interviews = await Interview.find(query)
    .sort({ [sortPath]: order === "asc" ? 1 : -1 })
    .lean();

  return interviews.map((i) => ({
    id: i._id,
    role: i.role,
    interviewType: i.interviewType,
    difficulty: i.difficulty,
    date: i.completedAt || i.startedAt,
    score: i.scores?.overall ?? null,
    status: i.status,
  }));
}