import React, { useContext, useMemo, useState } from "react";
import { DataContext } from "../../../context/DataContext";

const ACCENT = "#28303E";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- phone helpers ---
const onlyDigitsPlus = (s = "") => (s || "").replace(/[^\d+]/g, "");
const normalizeTelHref = (s = "") => {
  // keep leading + if present, otherwise add for known codes
  const cleaned = onlyDigitsPlus(s);
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("1")) return `+${cleaned}`; // US
  if (cleaned.startsWith("977")) return `+${cleaned}`; // Nepal
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
};

const formatPhone = (s = "") => {
  const raw = s.trim();
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");

  // US (+1) → +1 (AAA) BBB CCCC
  if (digits.startsWith("1") || raw.startsWith("+1")) {
    const ten = digits.replace(/^1/, ""); // strip leading country code
    if (ten.length === 10) {
      return `+1 (${ten.slice(0, 3)}) ${ten.slice(3, 6)} ${ten.slice(6)}`;
    }
    // if not 10, just show with +1
    return `+1 ${ten}`;
  }

  // Nepal (+977) → +977 NNNNNNNNNN (keep spacing simple)
  if (digits.startsWith("977") || raw.startsWith("+977")) {
    const local = digits.replace(/^977/, "");
    return `+977 ${local}`;
  }

  // Fallback
  return raw;
};

const LookingTable = () => {
  const { travelCompanion } = useContext(DataContext);
  const base = (travelCompanion || []).filter((item) => !item.date);

  const [qFrom, setQFrom] = useState("");
  const [qTo, setQTo] = useState("");
  const [qMonth, setQMonth] = useState("");

  const lookingEntries = useMemo(() => {
    return base.filter((e) => {
      const okFrom = qFrom
        ? e.fromLocation?.toLowerCase().includes(qFrom.toLowerCase())
        : true;
      const okTo = qTo
        ? e.toLocation?.toLowerCase().includes(qTo.toLowerCase())
        : true;
      const okMonth = qMonth
        ? (e.tentativeMonth || "").toLowerCase() === qMonth.toLowerCase()
        : true;
      return okFrom && okTo && okMonth;
    });
  }, [base, qFrom, qTo, qMonth]);

  if (!base.length) {
    return (
      <div className="mt-12 mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-600">
          No “looking for companion” posts yet. Be the first to share yours!
        </p>
        <a
          href="/post-looking"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[var(--accent,#2563EB)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ ["--accent"]: ACCENT }}
        >
          👀 Post You’re Looking
        </a>
      </div>
    );
  }

  return (
    <div className="mt-14">
      {/* Header */}
      <div
        className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-[#eef3ff] to-white p-5"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
        }}
      >
        <h2 className="text-xl font-bold text-gray-900">
          People Looking for Travel Companion{" "}
          <span className="ml-1 align-middle text-xs font-semibold text-gray-500">
            (Flexible Dates)
          </span>
        </h2>

        {/* Filters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            value={qFrom}
            onChange={(e) => setQFrom(e.target.value)}
            placeholder="From (e.g., JFK)"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            value={qTo}
            onChange={(e) => setQTo(e.target.value)}
            placeholder="To (e.g., Kathmandu)"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <select
            value={qMonth}
            onChange={(e) => setQMonth(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="">Any month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              <th className="px-5 py-3">From</th>
              <th className="px-5 py-3">To</th>
              <th className="px-5 py-3">Approx. Month</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lookingEntries.map((entry) => {
              const telHref = normalizeTelHref(entry.contact);
              return (
                <tr key={entry.$id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {entry.fromLocation}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {entry.toLocation}
                  </td>
                  <td className="px-5 py-3">
                    {entry.tentativeMonth ? (
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          background: "rgba(37,99,235,.08)",
                          color: ACCENT,
                        }}
                      >
                        {entry.tentativeMonth}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {entry.contact ? (
                      <a
                        href={`tel:${telHref}`}
                        className="font-semibold text-[var(--accent,#2563EB)] hover:underline"
                        style={{ ["--accent"]: ACCENT }}
                      >
                        {formatPhone(entry.contact)}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {entry.description || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 grid gap-4 md:hidden">
        {lookingEntries.map((entry) => {
          const telHref = normalizeTelHref(entry.contact);
          return (
            <div
              key={entry.$id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  {entry.fromLocation} → {entry.toLocation}
                </h3>
                {entry.tentativeMonth && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ background: "rgba(37,99,235,.08)", color: ACCENT }}
                  >
                    {entry.tentativeMonth}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700">
                {entry.description || "—"}
              </p>
              <div className="mt-3 text-sm">
                {entry.contact ? (
                  <a
                    href={`tel:${telHref}`}
                    className="font-semibold text-[var(--accent,#2563EB)] hover:underline"
                    style={{ ["--accent"]: ACCENT }}
                  >
                    {formatPhone(entry.contact)}
                  </a>
                ) : (
                  <span className="text-gray-400">No contact provided</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No results for current filters */}
      {lookingEntries.length === 0 && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-600">
          No results match your filters. Try clearing them.
        </div>
      )}
    </div>
  );
};

export default LookingTable;
