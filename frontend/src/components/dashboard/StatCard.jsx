export default function StatCard({ label, value, suffix }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-mono-tabular text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
        {suffix && <span className="ml-1 text-base font-normal text-slate-400">{suffix}</span>}
      </p>
    </div>
  );
}