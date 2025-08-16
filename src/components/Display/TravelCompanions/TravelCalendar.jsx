import React, { useState, useContext, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";

const ACCENT = "#EC3922";
const formatDate = (date) => date.toISOString().split("T")[0];

const TravelCalendar = () => {
  const { travelCompanion } = useContext(DataContext);
  const [datesWithCompanions, setDatesWithCompanions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [doubleView, setDoubleView] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 640 : true
  );
  const navigate = useNavigate();

  // Responsive calendar view
  useEffect(() => {
    const handleResize = () => setDoubleView(window.innerWidth >= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map dates -> companions[]
  useEffect(() => {
    const map = {};
    (travelCompanion || [])
      .filter((c) => !!c.date)
      .forEach((entry) => {
        const k = formatDate(new Date(entry.date));
        map[k] = map[k] ? [...map[k], entry] : [entry];
      });
    setDatesWithCompanions(map);
  }, [travelCompanion]);

  const totalCount = useMemo(
    () =>
      Object.values(datesWithCompanions).reduce(
        (n, arr) => n + (arr?.length || 0),
        0
      ),
    [datesWithCompanions]
  );

  const handleDateClick = (date) => {
    const key = formatDate(date);
    setSelectedDate(key);
    setCompanions(datesWithCompanions[key] || []);
  };

  return (
    <div className="px-4 pb-20">
      {/* Header / Hero */}
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#eef3ff] to-white"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <div className="flex flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-end sm:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Find a Travel Companion
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Pick a date to see who’s flying.{" "}
              <span className="font-semibold text-gray-800">{totalCount}</span>{" "}
              companion{totalCount === 1 ? "" : "s"} posted.
            </p>
          </div>
          <div
            className="rounded-xl px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(236, 57, 34, 0.12)", // #EC3922 with ~12% opacity
              color: "#EC3922",
              border: "1px solid rgba(236, 57, 34, 0.2)", // #EC3922 with ~20% opacity
            }}
          >
            HamroNYC • Travel
          </div>
        </div>

        {/* Calendar in soft card */}
        <div className="border-t border-gray-100 bg-white/70 px-4 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-[90vw] sm:max-w-3xl">
            <Calendar
              onClickDay={handleDateClick}
              showDoubleView={doubleView}
              calendarType="gregory"
              minDate={new Date()}
              tileContent={({ date }) => {
                const key = formatDate(date);
                const count = datesWithCompanions[key]?.length || 0;
                return count > 0 ? (
                  <div className="relative h-full w-full">
                    {/* tiny pill in corner */}
                    <div
                      className="absolute right-1.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                      style={{ background: ACCENT }}
                    >
                      {count}
                    </div>
                    {/* dot under number */}
                    <div
                      className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                      style={{ background: ACCENT }}
                    />
                  </div>
                ) : null;
              }}
              tileClassName={({ date }) =>
                selectedDate === formatDate(date) ? "rc-selected" : "rc-default"
              }
              className="react-calendar w-full rounded-2xl border border-gray-100 p-3"
            />
          </div>

          {/* Legend */}
          <div className="mx-auto mt-4 flex max-w-3xl items-center justify-center gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: ACCENT }}
              />
              Dates with companions
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 rounded-full text-[10px] text-white grid place-items-center"
                style={{ background: ACCENT }}
              >
                #
              </span>{" "}
              Count per day
            </span>
          </div>
        </div>
      </div>

      {/* Selected date summary */}
      {selectedDate && (
        <div className="mx-auto mt-10 max-w-5xl">
          <div
            className="mb-6 rounded-2xl border border-gray-100 bg-white px-5 py-4 text-center shadow-sm"
            style={{
              boxShadow:
                "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
            }}
          >
            <h2 className="text-xl font-bold text-gray-900">
              Companions on{" "}
              <span
                className="text-[var(--accent,#2563EB)]"
                style={{ ["--accent"]: ACCENT }}
              >
                {new Date(selectedDate).toDateString()}
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {companions.length} companion{companions.length === 1 ? "" : "s"}{" "}
              found for this day.
            </p>
          </div>

          {companions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {companions.map((c) => {
                const via = c.transitAirport?.toUpperCase();
                const name = (() => {
                  try {
                    return c.postedByName
                      ? c.postedByName
                          .split(" ")
                          .map(
                            (w) =>
                              w.charAt(0).toUpperCase() +
                              w.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : "Not provided";
                  } catch {
                    return "Not provided";
                  }
                })();

                return (
                  <div
                    key={c.$id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <p className="mb-1 text-base font-bold text-gray-900">
                      {c.fromLocation} → {c.toLocation}
                      {via && (
                        <span className="ml-1 text-sm font-medium text-gray-500">
                          {" "}
                          (via {via})
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700">
                      {c.description || "No details provided."}
                    </p>

                    <div className="mt-4 space-y-1 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">
                          📞 Contact:
                        </span>{" "}
                        {c.contact ? (
                          <a
                            href={`tel:${c.contact}`}
                            className="font-medium text-[var(--accent,#2563EB)] hover:underline"
                            style={{ ["--accent"]: ACCENT }}
                          >
                            {c.contact}
                          </a>
                        ) : (
                          <span className="text-gray-500">Not provided</span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          👤 Posted By:
                        </span>{" "}
                        <span className="font-medium">{name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No companions available on this date.
            </p>
          )}
        </div>
      )}

      {/* Tiny CSS touch-ups for react-calendar */}
      <style>{`
        .react-calendar {
          font-family: inherit;
        }
        .react-calendar .react-calendar__tile {
          border-radius: 10px;
        }
        .react-calendar .react-calendar__tile:hover {
          background: #f5f7ff;
        }
        .rc-selected {
          background: ${ACCENT} !important;
          color: #fff !important;
          border-radius: 9999px;
          font-weight: 600;
        }
        .rc-default {
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default TravelCalendar;
