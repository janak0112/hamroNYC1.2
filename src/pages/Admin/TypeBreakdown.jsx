import React from "react";
import { cardBase } from "./ui";

export default function TypeBreakdown({ typeCounts }) {
  const keys = ["rooms", "jobs", "market", "events", "travelCompanion"];
  return (
    <div className={`${cardBase} p-4`}>
      <h3 className="mb-2 text-sm font-semibold text-gray-800">By type</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700">
        {keys.map((t) => (
          <div
            key={t}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
          >
            <span className="capitalize">{humanizeType(t)}</span>
            <span className="font-medium text-gray-800">
              {typeCounts[t] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function humanizeType(t) {
  if (t === "travelCompanion") return "Travel";
  return t?.charAt(0).toUpperCase() + t?.slice(1);
}
