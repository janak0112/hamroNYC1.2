import React from "react";
import { BRAND, cardBase } from "./ui";
import { CalendarDays } from "lucide-react";

export default function SparklineCard({ series, title = "Posts per day" }) {
  const data = series.map((d) => d.count);
  const days = series.length;

  return (
    <div className={`${cardBase} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays className="h-4 w-4" />
          {days} days
        </div>
      </div>
      <Sparkline data={data} />
    </div>
  );
}

function Sparkline({ data }) {
  const width = 560,
    height = 120,
    pad = 8;
  const max = Math.max(1, ...data);
  const step = data.length > 1 ? (width - pad * 2) / (data.length - 1) : 0;
  const last = data.at(-1) || 0;

  const points = data
    .map((y, i) => {
      const px = pad + i * step;
      const py = height - pad - (y / max) * (height - pad * 2);
      return `${px},${py}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl bg-white p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-[${BRAND}]`}
        />
        <line
          x1="0"
          x2={width}
          y1={height - 8}
          y2={height - 8}
          className="stroke-gray-200"
        />
        {data.length > 0 && (
          <circle
            cx={pad + (data.length - 1) * step}
            cy={height - pad - (last / max) * (height - pad * 2)}
            r="3"
            className={`fill-[${BRAND}]`}
          />
        )}
      </svg>
      <div className="mt-1 text-xs text-gray-500">
        Max daily: <span className="font-medium text-gray-800">{max}</span>
      </div>
    </div>
  );
}
