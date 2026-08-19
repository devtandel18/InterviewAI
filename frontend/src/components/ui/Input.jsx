import clsx from "clsx";

export default function Input({ label, error, className, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          "h-10 rounded-lg border bg-white dark:bg-[#080a0f] px-3 text-sm text-slate-900 dark:text-slate-100",
          "border-slate-300 dark:border-[#1f242e] placeholder:text-slate-400 dark:placeholder:text-slate-600",
          "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}