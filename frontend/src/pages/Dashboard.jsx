import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import PerformanceOverview from "../components/dashboard/PerformanceOverview";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { getDashboardRequest } from "../api/dashboardApi";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDashboardRequest()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your dashboard. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {greeting()}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's how your practice is going.
          </p>
        </div>
        <Link to="/interviews/new">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Start New Interview
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="mt-10 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>
      )}

      {data && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Interviews completed" value={data.stats.interviewsCompleted} />
            <StatCard label="Average score" value={data.stats.averageScore} suffix="%" />
            <StatCard label="Questions answered" value={data.stats.questionsAnswered} />
            <StatCard label="Current streak" value={data.stats.currentStreak} suffix="days" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Recent interviews
              </h2>
              <RecentInterviews interviews={data.recentInterviews} />
            </div>
            <div>
              <PerformanceOverview overview={data.performanceOverview} />
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}