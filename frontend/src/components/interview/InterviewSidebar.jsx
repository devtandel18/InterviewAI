import { Bot } from "lucide-react";

export default function InterviewSidebar({ interview, answeredCount, totalQuestions }) {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-6 border-l border-slate-200 dark:border-[#1f242e] p-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Bot className="h-4 w-4 text-brand-500" />
          AI Interviewer
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Answer as you would in a real interview — talk through your reasoning, not just the
          final answer.
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-600">
          Instructions
        </p>
        <ul className="mt-2 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
          <li>You can skip a question if you're unsure — it won't be scored as wrong.</li>
          <li>Your score is revealed only in the final report, not after each question.</li>
          <li>Ending early still generates a report from what you've answered so far.</li>
        </ul>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-600">
          Session stats
        </p>
        <div className="mt-2 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Role</span>
            <span className="text-slate-900 dark:text-white">{interview.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Type</span>
            <span className="text-slate-900 dark:text-white">{interview.interviewType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Difficulty</span>
            <span className="text-slate-900 dark:text-white">{interview.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="font-mono-tabular text-slate-900 dark:text-white">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}