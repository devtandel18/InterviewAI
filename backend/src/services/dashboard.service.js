import { Interview } from "../models/Interview.model.js";

const RECENT_LIMIT = 5;

function average(numbers) {
  const valid = numbers.filter((n) => typeof n === "number" && !Number.isNaN(n));
  if (!valid.length) return 0;
  return Math.round(valid.reduce((sum, n) => sum + n, 0) / valid.length);
}

/**
 * Streak = consecutive days (ending today or yesterday) that have at
 * least one completed interview. Breaks the moment a day is missing.
 */
function calculateStreak(completedDates) {
  if (!completedDates.length) return 0;

  const daySet = new Set(
    completedDates.map((d) => new Date(d).toISOString().slice(0, 10))
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Allow the streak to still count if today has no session yet,
  // as long as yesterday does — otherwise a user checking the
  // dashboard before practicing today would see their streak drop
  // to zero prematurely.
  if (!daySet.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getDashboardStats(userId) {
  const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 }).lean();

  const completed = interviews.filter((i) => i.status === "completed");

  const stats = {
    interviewsCompleted: completed.length,
    averageScore: average(completed.map((i) => i.scores?.overall)),
    questionsAnswered: interviews.reduce((sum, i) => sum + (i.questionsAnswered || 0), 0),
    currentStreak: calculateStreak(completed.map((i) => i.completedAt).filter(Boolean)),
  };

  const performanceOverview = {
    technicalKnowledge: average(completed.map((i) => i.scores?.technicalKnowledge)),
    problemSolving: average(completed.map((i) => i.scores?.problemSolving)),
    communication: average(completed.map((i) => i.scores?.communication)),
    systemDesign: average(completed.map((i) => i.scores?.systemDesign)),
    overallScore: stats.averageScore,
  };

  const recentInterviews = interviews.slice(0, RECENT_LIMIT).map((i) => ({
    id: i._id,
    role: i.role,
    interviewType: i.interviewType,
    difficulty: i.difficulty,
    date: i.completedAt || i.startedAt,
    score: i.scores?.overall ?? null,
    status: i.status,
  }));

  return { stats, performanceOverview, recentInterviews };
}