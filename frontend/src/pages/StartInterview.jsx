import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, ClipboardCheck, Sparkles } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { createInterviewRequest } from "../api/interviewApi";
import { TARGET_ROLES } from "../utils/constants";

const INTERVIEW_TYPES = ["Technical", "Behavioral", "System Design", "Mixed"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [5, 10, 15];
const DURATIONS = [15, 30, 45];

const HOW_IT_WORKS = [
  {
    icon: Sparkles,
    text: "Questions are generated for your chosen role, type, and difficulty.",
  },
  {
    icon: Bot,
    text: "Answer at your own pace — the AI may ask a follow-up if it helps.",
  },
  {
    icon: ClipboardCheck,
    text: "You'll get a full evaluation and report once the interview ends.",
  },
];

export default function StartInterview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: user?.targetRole || "",
    interviewType: "Technical",
    difficulty: "Medium",
    numQuestions: 5,
    durationMinutes: 30,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numeric = name === "numQuestions" || name === "durationMinutes";
    setForm((f) => ({ ...f, [name]: numeric ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const interview = await createInterviewRequest(form);
      navigate(`/interviews/${interview._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't start the interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Set up your interview
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose what you want to practice today.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Select
            id="role"
            name="role"
            label="Role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>

          <Select
            id="interviewType"
            name="interviewType"
            label="Interview type"
            value={form.interviewType}
            onChange={handleChange}
          >
            {INTERVIEW_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Select
            id="difficulty"
            name="difficulty"
            label="Difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-5">
            <Select
              id="numQuestions"
              name="numQuestions"
              label="Number of questions"
              value={form.numQuestions}
              onChange={handleChange}
            >
              {QUESTION_COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>

            <Select
              id="durationMinutes"
              name="durationMinutes"
              label="Duration"
              value={form.durationMinutes}
              onChange={handleChange}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} minutes
                </option>
              ))}
            </Select>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-slate-50 dark:bg-[#12151c] p-5">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              How the AI interview works
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {HOW_IT_WORKS.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Start Interview
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
}