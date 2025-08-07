import React, { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

const LookingTable = () => {
  const { travelCompanion } = useContext(DataContext);
  const lookingEntries = travelCompanion.filter((item) => !item.date);

  if (lookingEntries.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        People Looking for Travel Companion <br />
        <span className="text-base font-medium text-gray-500">
          (Flexible Dates)
        </span>
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-700 uppercase tracking-wider text-xs">
              <th className="px-5 py-3 font-semibold">From</th>
              <th className="px-5 py-3 font-semibold">To</th>
              <th className="px-5 py-3 font-semibold">Approx. Month</th>
              <th className="px-5 py-3 font-semibold">Contact</th>
              <th className="px-5 py-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {lookingEntries.map((entry) => (
              <tr key={entry.$id} className="hover:bg-gray-50 transition-all">
                <td className="px-5 py-3 font-medium text-gray-800">
                  {entry.fromLocation}
                </td>
                <td className="px-5 py-3 font-medium text-gray-800">
                  {entry.toLocation}
                </td>
                <td className="px-5 py-3">{entry.tentativeMonth || "—"}</td>
                <td className="px-5 py-3 text-[#2563eb] font-semibold">
                  {entry.contact || "Not provided"}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {entry.description || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LookingTable;
