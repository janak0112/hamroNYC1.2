import React from "react";
import { cardBase } from "./ui";

export default function KPI({ title, value, icon: Icon, sub, trend }) {
  return (
    <div className={`${cardBase} p-4 transition hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-800">
              {value}
            </span>
            {typeof trend === "number" && <TrendPill trend={trend} />}
          </div>
        </div>
        <div className="rounded-full bg-gray-50 p-2">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      {sub && <p className="mt-2 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function TrendPill({ trend }) {
  const up = trend >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs ${
        up ? "text-emerald-700" : "text-rose-700"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" className="inline-block">
        <path
          d={up ? "M5 12l4-4 4 4" : "M5 8l4 4 4-4"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {Math.abs(trend)}%
    </span>
  );
}
