import React from "react";
import { Users2 } from "lucide-react";
import { cardBase } from "./ui";

export default function Contributors({ contributors = [] }) {
  return (
    <div className={`${cardBase} p-4`}>
      <h3 className="mb-2 text-sm font-semibold text-gray-800">
        Top Contributors
      </h3>
      {contributors.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-600">
          No contributors in range.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {contributors.map((c) => (
            <li key={c.name} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-800">{c.name}</span>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {c.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
