import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const STATUS_STYLES = {
  completed: "text-success bg-success/10",
  in_progress: "text-amber-signal bg-amber-signal/10",
  abandoned: "text-slate-400 bg-slate-400/10",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function RecentInterviews({ interviews }) {
  if (!interviews.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No interviews yet — start your first one to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-[#1f242e] text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-600">
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Score</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview) => (
            <tr
              key={interview.id}
              className="border-b border-slate-100 dark:border-[#1f242e]/60 last:border-0 hover:bg-slate-50 dark:hover:bg-[#0b0e14]"
            >
              <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                {interview.role}
              </td>
              <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                {interview.interviewType}
              </td>
              <td className="px-5 py-3 font-mono-tabular text-slate-500 dark:text-slate-400">
                {formatDate(interview.date)}
              </td>
              <td className="px-5 py-3 font-mono-tabular text-slate-900 dark:text-white">
                {interview.score ?? "—"}
              </td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    STATUS_STYLES[interview.status] || STATUS_STYLES.abandoned
                  }`}
                >
                  {interview.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        to="/interviews"
        className="flex items-center justify-center gap-1 border-t border-slate-200 dark:border-[#1f242e] py-3 text-sm font-medium text-brand-500 hover:text-brand-400"
      >
        View all interviews
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}