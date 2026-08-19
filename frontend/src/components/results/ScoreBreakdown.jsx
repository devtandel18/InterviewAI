const METRICS = [
  { key: "technicalKnowledge", label: "Technical Knowledge" },
  { key: "problemSolving", label: "Problem Solving" },
  { key: "communication", label: "Communication" },
  { key: "systemDesign", label: "System Design" },
];

export default function ScoreBreakdown({ scores }) {
  return (
    <div className="flex flex-col gap-4">
      {METRICS.map(({ key, label }) => (
        <div key={key}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{label}</span>
            <span className="font-mono-tabular text-slate-900 dark:text-white">{scores[key]}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f242e]">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${scores[key]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}