import React from "react";
import { BRAND } from "./ui"; // adjust path

export default function RangeChips({ range, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 p-1">
      {["7d", "30d", "all"].map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            range === r
              ? `text-white bg-[${BRAND}] shadow-sm hover:opacity-95 focus:ring-[${BRAND}]`
              : `text-gray-700 hover:bg-white focus:ring-[${BRAND}]`
          }`}
          title={`Show ${r}`}
        >
          {r === "7d"
            ? "Last 7 days"
            : r === "30d"
            ? "Last 30 days"
            : "All Time"}
        </button>
      ))}
    </div>
  );
}
