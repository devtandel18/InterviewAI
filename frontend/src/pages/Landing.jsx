import { Link } from "react-router-dom";
import {
  Sparkles,
  MessageSquareText,
  Radio,
  LineChart,
  History,
  Layers,
  ArrowRight,
  User,
  Bot,
  ClipboardCheck,
  FileBarChart,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-powered technical interviews",
    desc: "Questions generated for your target role, difficulty, and interview type — not a static question bank.",
  },
  {
    icon: MessageSquareText,
    title: "Personalized feedback",
    desc: "Evaluation that looks at correctness, depth, problem-solving, and communication, not just pass/fail.",
  },
  {
    icon: Radio,
    title: "Real-time interview experience",
    desc: "A focused, timed interview flow that feels close to the real thing.",
  },
  {
    icon: LineChart,
    title: "Performance tracking",
    desc: "Watch technical knowledge, problem solving, and communication trend over every session.",
  },
  {
    icon: History,
    title: "Interview history",
    desc: "Every past interview, searchable and filterable, with the full report one click away.",
  },
  {
    icon: Layers,
    title: "Role-specific questions",
    desc: "Frontend, backend, full stack, ML, and more — tuned to what you're actually interviewing for.",
  },
];

const PIPELINE = [
  { icon: User, label: "Candidate" },
  { icon: Bot, label: "AI Interviewer" },
  { icon: ClipboardCheck, label: "Evaluation" },
  { icon: FileBarChart, label: "Performance Report" },
];

export default function Landing() {
  return (
    <div className="bg-white dark:bg-[#0b0e14]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#635bff 1px, transparent 1px), linear-gradient(90deg, #635bff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at 50% 0%, black, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-[#1f242e] bg-slate-50 dark:bg-[#12151c] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            Built for software engineering interviews
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
            Practice Interviews. Build Confidence. Get Better.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400">
            AI-powered technical interviews that simulate real software engineering interviews
            and provide actionable feedback.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-1.5">
                Start Interview
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pipeline visual */}
      <section id="pipeline" className="border-y border-slate-200 dark:border-[#1f242e] bg-slate-50 dark:bg-[#0b0e14] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center font-mono-tabular text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600">
            The loop
          </p>
          <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
            {PIPELINE.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] text-brand-500 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                  </span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-slate-300 dark:text-slate-700 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Everything you need to walk in ready
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              A practice loop that mirrors the real interview, from the first question to the
              final report.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6 transition-colors hover:border-brand-500/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 dark:border-[#1f242e] bg-slate-50 dark:bg-[#12151c] px-8 py-14 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
            Your next interview shouldn&apos;t be your first real one.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
            Set up a session in under a minute and see where you actually stand.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-7 gap-1.5">
              Start Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-[#1f242e] px-6 py-8 text-center text-xs text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} InterviewAI. All rights reserved.
      </footer>
    </div>
  );
}