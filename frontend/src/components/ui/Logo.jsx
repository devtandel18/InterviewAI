import clsx from "clsx";

export default function Logo({ className }) {
  return (
    <div className={clsx("flex items-center gap-2 font-display font-semibold", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-sm text-white">
        {"</>"}
      </span>
      <span className="text-slate-900 dark:text-white tracking-tight">
        Interview<span className="text-brand-500">AI</span>
      </span>
    </div>
  );
}