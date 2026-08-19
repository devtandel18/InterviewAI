import { axiosClient } from "./axiosClient";

export async function createInterviewRequest(payload) {
  const { data } = await axiosClient.post("/interviews", payload);
  return data.data.interview;
}

export async function getInterviewProgressRequest(interviewId) {
  const { data } = await axiosClient.get(`/interviews/${interviewId}/progress`);
  return data.data;
}

export async function submitAnswerRequest(interviewId, { questionId, content, skipped }) {
  const { data } = await axiosClient.post(`/interviews/${interviewId}/answers`, {
    questionId,
    content,
    skipped,
  });
  return data.data;
}

export async function completeInterviewRequest(interviewId) {
  const { data } = await axiosClient.post(`/interviews/${interviewId}/complete`);
  return data.data.interview;
}

export async function getEvaluationRequest(interviewId) {
  const { data } = await axiosClient.get(`/interviews/${interviewId}/evaluation`);
  return data.data.interview;
}

export async function listInterviewsRequest(params) {
  const { data } = await axiosClient.get("/interviews", { params });
  return data.data.interviews;
}