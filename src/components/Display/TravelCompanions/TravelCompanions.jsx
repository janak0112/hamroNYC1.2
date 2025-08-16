// TravelCompanions.jsx
import React, { useState } from "react";
import TravelCalendar from "./TravelCalendar";
import LookingTable from "./LookingTable";
import "./Calender.css"; // keep your calendar tweaks

const ACCENT = "#EB3822";

const TravelCompanions = () => {
  const [tab, setTab] = useState("calendar"); // "calendar" | "requests"

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header / hero card */}
      <div
        className="overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#eef3ff] to-white p-6 sm:p-8"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find or Offer{" "}
              <span
                className="text-[var(--accent,#2563EB)]"
                style={{ ["--accent"]: ACCENT }}
              >
                Travel Companion
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Browse travel dates on the calendar or view open requests. Post
              your own itinerary or let others know you’re looking.
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <a
              href="/add-your-flight"
              className="rounded-xl bg-[var(--accent,#28303E)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ ["--accent"]: "#28303E" }}
            >
              ✈️ Add Your Flight
            </a>

            <a
              href="/post-looking"
              className="rounded-xl border border-[var(--accent,#28303E)] px-4 py-2 text-sm font-semibold text-[var(--accent,#28303E)] transition hover:bg-[#eef3ff]"
              style={{ ["--accent"]: "#28303E" }}
            >
              👀 I’m Looking
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-grid grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-white p-1">
          {[
            { id: "calendar", label: "Calendar" },
            { id: "requests", label: "Requests" },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === id
                  ? "bg-[var(--accent,#2563EB)] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              style={{ ["--accent"]: ACCENT }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mt-10 space-y-10">
        {/* Calendar card */}
        {tab === "calendar" && (
          <section
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 sm:p-6"
            style={{
              boxShadow:
                "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
            }}
          >
            <TravelCalendar />
          </section>
        )}

        {/* Requests card */}
        {tab === "requests" && (
          <section
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 sm:p-6"
            style={{
              boxShadow:
                "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
            }}
          >
            <LookingTable />
          </section>
        )}

        {/* Safety / disclaimer block */}
        <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-gray-700">
          <p className="font-semibold text-yellow-800">
            ⚠️ Safety & Disclaimer
          </p>
          <p className="mt-1">
            This feature is intended <strong>only</strong> to help people find
            companions for flights—especially{" "}
            <strong>Ama, Buwa, and first-time travelers</strong> who may need
            assistance. Do not use this to send documents, luggage, or personal
            items.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TravelCompanions;
