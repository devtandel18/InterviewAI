import clsx from "clsx";

export default function ListSection({ icon: Icon, title, items, tone = "neutral" }) {
  const toneStyles = {
    positive: "text-success",
    negative: "text-amber-signal",
    neutral: "text-brand-500",
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
      <div className="flex items-center gap-2">
        <Icon className={clsx("h-4 w-4", toneStyles[tone])} />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className={clsx("mt-1.5 h-1 w-1 shrink-0 rounded-full", toneStyles[tone])} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}