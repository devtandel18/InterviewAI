import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const STAGES = ["candidate", "ai-interviewer", "evaluation", "report"];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-white dark:bg-[#0b0e14] lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <Link to="/">
          <Logo />
        </Link>

        <div className="mx-auto w-full max-w-sm py-12">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600">
          &copy; {new Date().getFullYear()} InterviewAI
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-[#080a0f] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#635bff 1px, transparent 1px), linear-gradient(90deg, #635bff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative flex flex-col items-center gap-6 px-12 text-center">
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-brand-400">
            build → evaluate → improve
          </p>
          <div className="flex items-center gap-3">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#1f242e] bg-[#12151c] text-brand-400 shadow-lg shadow-black/20">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                </div>
                {i < STAGES.length - 1 && <span className="h-px w-6 bg-[#1f242e]" />}
              </div>
            ))}
          </div>
          <p className="max-w-xs text-sm text-slate-400">
            Every session runs the same pipeline a real interview loop does — structured
            questions, honest evaluation, a report you can act on.
          </p>
        </div>
      </div>
    </div>
  );
}