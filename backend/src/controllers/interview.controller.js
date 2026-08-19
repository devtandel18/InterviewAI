import asyncHandler from "express-async-handler";
import * as interviewService from "../services/interview.service.js";

export const createInterview = asyncHandler(async (req, res) => {
  const { role, interviewType, difficulty, numQuestions, durationMinutes } = req.body;
  const interview = await interviewService.createInterview(req.user._id, {
    role,
    interviewType,
    difficulty,
    numQuestions,
    durationMinutes,
  });

  res.status(201).json({ success: true, data: { interview } });
});

export const getInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.getInterviewById(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: { interview } });
});

export const getProgress = asyncHandler(async (req, res) => {
  const progress = await interviewService.getInterviewProgress(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: progress });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, content, skipped } = req.body;
  const progress = await interviewService.submitAnswer(
    req.user._id,
    req.params.id,
    questionId,
    { content, skipped }
  );
  res.status(200).json({ success: true, data: progress });
});

export const completeInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.completeInterview(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: { interview } });
});

export const getEvaluation = asyncHandler(async (req, res) => {
  const interview = await interviewService.getEvaluationForInterview(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: { interview } });
});

export const getInterviews = asyncHandler(async (req, res) => {
  const { search, role, interviewType, difficulty, status, sortBy, order } = req.query;
  const interviews = await interviewService.listInterviews(req.user._id, {
    search,
    role,
    interviewType,
    difficulty,
    status,
    sortBy,
    order,
  });
  res.status(200).json({ success: true, data: { interviews } });
});