import { Interview } from "../models/Interview.model.js";

function average(numbers) {
  const valid = numbers.filter((n) => typeof n === "number");
  if (!valid.length) return 0;
  return Math.round(valid.reduce((sum, n) => sum + n, 0) / valid.length);
}

const SKILL_LABELS = {
  technicalKnowledge: "Technical Knowledge",
  problemSolving: "Problem Solving",
  communication: "Communication",
  systemDesign: "System Design",
};

export async function getPerformanceAnalytics(userId) {
  const completed = await Interview.find({ user: userId, status: "completed" })
    .sort({ completedAt: 1 })
    .lean();

  const scoreOverTime = completed.map((i) => ({
    date: i.completedAt,
    score: i.scores?.overall ?? 0,
  }));

  const skillAverages = {
    technicalKnowledge: average(completed.map((i) => i.scores?.technicalKnowledge)),
    problemSolving: average(completed.map((i) => i.scores?.problemSolving)),
    communication: average(completed.map((i) => i.scores?.communication)),
    systemDesign: average(completed.map((i) => i.scores?.systemDesign)),
  };

  const currentAverage = average(completed.map((i) => i.scores?.overall));
  const bestScore = completed.length ? Math.max(...completed.map((i) => i.scores?.overall ?? 0)) : 0;

  const skillEntries = Object.entries(skillAverages);
  const strongest = skillEntries.length
    ? skillEntries.reduce((a, b) => (b[1] > a[1] ? b : a))
    : null;
  const weakest = skillEntries.length
    ? skillEntries.reduce((a, b) => (b[1] < a[1] ? b : a))
    : null;

  const recommendations = [];
  if (weakest && weakest[1] < 70) {
    recommendations.push(
      `Focus your next few sessions on ${SKILL_LABELS[weakest[0]]} — it's currently your lowest-scoring area.`
    );
  }
  if (completed.length < 3) {
    recommendations.push("Complete a few more interviews for more reliable trend data.");
  }
  if (currentAverage >= 80) {
    recommendations.push("Your scores are strong and consistent — try increasing difficulty to keep growing.");
  }
  if (!recommendations.length) {
    recommendations.push("Keep practicing consistently to build a clearer performance trend.");
  }

  return {
    currentAverage,
    bestScore,
    strongestSkill: strongest ? SKILL_LABELS[strongest[0]] : null,
    weakestSkill: weakest ? SKILL_LABELS[weakest[0]] : null,
    scoreOverTime,
    skillAverages,
    recommendations,
  };
}