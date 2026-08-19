export default function ScoreLineChart({ data }) {
  if (!data.length) return null;

  const width = 600;
  const height = 220;
  const padding = 32;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (d.score / 100) * (height - padding * 2);
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {[0, 25, 50, 75, 100].map((val) => {
        const y = height - padding - (val / 100) * (height - padding * 2);
        return (
          <g key={val}>
            <line
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              className="stroke-slate-100 dark:stroke-[#1f242e]"
              strokeWidth="1"
            />
            <text x={4} y={y + 4} className="fill-slate-400 text-[10px]">
              {val}
            </text>
          </g>
        );
      })}

      <path d={path} fill="none" className="stroke-brand-500" strokeWidth="2" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" className="fill-brand-500" />
          <text x={p.x} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[10px]">
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  );
}