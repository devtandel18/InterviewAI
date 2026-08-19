import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThumbsUp, TrendingUp, BookOpen, RotateCcw, History } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";
import ScoreRing from "../components/results/ScoreRing";
import ScoreBreakdown from "../components/results/ScoreBreakdown";
import ListSection from "../components/results/ListSection";
import Button from "../components/ui/Button";
import { getEvaluationRequest } from "../api/interviewApi";

export default function InterviewResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getEvaluationRequest(id)
      .then((data) => {
        if (!cancelled) setInterview(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this report.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !interview) {
    return (
      <DashboardShell>
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error || "Report not found."}
        </p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {interview.role} · {interview.interviewType} · {interview.difficulty}
          </p>
          <ScoreRing score={interview.scores?.overall ?? 0} />
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            {interview.aiSummary}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Score breakdown
            </h3>
            <ScoreBreakdown scores={interview.scores || {}} />
          </div>

          <ListSection
            icon={ThumbsUp}
            title="Strengths"
            items={interview.strengths || []}
            tone="positive"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ListSection
            icon={TrendingUp}
            title="Areas for Improvement"
            items={interview.improvements || []}
            tone="negative"
          />
          <ListSection
            icon={BookOpen}
            title="Recommended Topics"
            items={interview.recommendedTopics || []}
            tone="neutral"
          />
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate("/interviews")} className="gap-1.5">
            <History className="h-4 w-4" />
            View Interview History
          </Button>
          <Button onClick={() => navigate("/interviews/new")} className="gap-1.5">
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}