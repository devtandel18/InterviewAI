import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import { listInterviewsRequest } from "../api/interviewApi";

const STATUS_STYLES = {
  completed: "text-success bg-success/10",
  in_progress: "text-amber-signal bg-amber-signal/10",
  abandoned: "text-slate-400 bg-slate-400/10",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    setLoading(true);
    listInterviewsRequest({ search: search || undefined, difficulty: difficulty || undefined, sortBy, order })
      .then(setInterviews)
      .finally(() => setLoading(false));
  }, [search, difficulty, sortBy, order]);

  const toggleOrder = () => setOrder((o) => (o === "asc" ? "desc" : "asc"));

  return (
    <DashboardShell>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Interview history</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Every past session, searchable and filterable.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by role or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-40">
          <option value="">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </Select>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-40">
          <option value="createdAt">Sort by date</option>
          <option value="score">Sort by score</option>
        </Select>
        <button
          onClick={toggleOrder}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-300 dark:border-[#1f242e] px-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#12151c]"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {order === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c]">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : interviews.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No interviews match your filters.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1f242e] text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-600">
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Difficulty</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => i.status === "completed" && navigate(`/interviews/${i.id}/results`)}
                  className={`border-b border-slate-100 dark:border-[#1f242e]/60 last:border-0 ${
                    i.status === "completed" ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-[#0b0e14]" : ""
                  }`}
                >
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{i.role}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{i.interviewType}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{i.difficulty}</td>
                  <td className="px-5 py-3 font-mono-tabular text-slate-500 dark:text-slate-400">
                    {formatDate(i.date)}
                  </td>
                  <td className="px-5 py-3 font-mono-tabular text-slate-900 dark:text-white">
                    {i.score ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        STATUS_STYLES[i.status] || STATUS_STYLES.abandoned
                      }`}
                    >
                      {i.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}