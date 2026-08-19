import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({ durationMinutes, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft, onExpire]);

  const isLow = secondsLeft <= 60;

  return (
    <div
      className={`flex items-center gap-1.5 font-mono-tabular text-sm ${
        isLow ? "text-red-500" : "text-slate-500 dark:text-slate-400"
      }`}
    >
      <Clock className="h-3.5 w-3.5" />
      {formatTime(Math.max(secondsLeft, 0))}
    </div>
  );
}