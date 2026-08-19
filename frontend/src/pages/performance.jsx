import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import ScoreLineChart from "../components/performance/ScoreLineChart";
import { getPerformanceRequest } from "../api/performanceApi";

const SKILL_LABELS = {
  technicalKnowledge: "Technical Knowledge",
  problemSolving: "Problem Solving",
  communication: "Communication",
  systemDesign: "System Design",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPerformanceRequest()
      .then((result) => setData(result))
      .catch((error) => {
        console.error("PERFORMANCE API ERROR:", error);
        setData({});
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      </DashboardShell>
    );
  }

  const chartData = (data?.scoreOverTime || []).map((d, i) => ({
    name: formatDate(d.date) || `#${i + 1}`,
    score: d.score,
  }));

  return (
    <DashboardShell>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Performance</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Track how your interviewing skills are trending.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Current average" value={data.currentAverage} suffix="%" />
        <StatCard label="Best score" value={data.bestScore} suffix="%" />
        <StatCard label="Strongest skill" value={data.strongestSkill || "—"} />
        <StatCard label="Weakest skill" value={data.weakestSkill || "—"} />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Score over time</h3>
        {chartData.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Complete a few interviews to see your trend.
          </p>
        ) : (
          <ScoreLineChart data={chartData} />
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">By skill</h3>
          <div className="flex flex-col gap-4">
            {Object.entries(SKILL_LABELS).map(([key, label]) => (
              <div key={key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{label}</span>
                  <span className="font-mono-tabular text-slate-900 dark:text-white">
                    {data.skillAverages?.[key] ?? 0}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f242e]">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${data.skillAverages?.[key] ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recommendations</h3>
          </div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {(data.recommendations || []).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}