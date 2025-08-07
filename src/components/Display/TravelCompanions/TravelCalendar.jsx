import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DataContext } from "../../../context/DataContext";

// Utility to normalize a date to YYYY-MM-DD (local time)
const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // '2025-08-27'
};

const TravelCalendar = () => {
  const { travelCompanion } = useContext(DataContext);
  const [datesWithCounts, setDatesWithCounts] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [companions, setCompanions] = useState([]);

  // 🔁 Build a date-to-companions map
  useEffect(() => {
    const counts = {};
    travelCompanion
      .filter((c) => !!c.date)
      .forEach((entry) => {
        const dateStr = formatDate(new Date(entry.date));
        if (counts[dateStr]) {
          counts[dateStr].push(entry);
        } else {
          counts[dateStr] = [entry];
        }
      });

    setDatesWithCounts(counts);
  }, [travelCompanion]);

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
    setCompanions(datesWithCounts[dateStr] || []);
  };

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl px-6 py-8 max-w-fit mx-auto">
        <Calendar
          onClickDay={handleDateClick}
          showDoubleView={true}
          calendarType="gregory"
          minDate={new Date()}
          tileContent={({ date }) => {
            const key = formatDate(date);
            const count = datesWithCounts[key]?.length || 0;
            return count > 0 ? (
              <div className="relative w-full h-full">
                <div className="absolute top-0.5 right-1.5 bg-[#2463EB] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full z-10">
                  {count}
                </div>
              </div>
            ) : null;
          }}
          tileClassName={({ date }) =>
            selectedDate === formatDate(date)
              ? "bg-[#2463EB] text-white font-semibold rounded-full"
              : "hover:bg-gray-100 rounded-full"
          }
          className="react-calendar w-full"
        />
      </div>
      <div className="mt-10 text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Want to post your travel?
        </h3>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/post-travel")} // replace with actual route
            className="bg-[#2563eb] text-white px-5 py-2 rounded-full hover:bg-[#1e4ed8] transition"
          >
            ✈️ Add Your Flight
          </button>
          <button
            onClick={() => navigate("/post-looking")} // replace with actual route
            className="border border-[#2563eb] text-[#2563eb] px-5 py-2 rounded-full hover:bg-[#ebf0ff] transition"
          >
            👀 Post You're Looking
          </button>
        </div>
      </div>

      <div className="mt-8 max-w-4xl mx-auto text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-medium text-yellow-800">⚠️ Disclaimer:</p>
        <p className="mt-2">
          This platform is intended{" "}
          <strong>only for individuals seeking travel companions</strong>
          —especially our
          <strong> Ama, Buwa, and first-time travelers</strong> who may need
          assistance navigating flights.
          <br />
          <strong>
            ⚠️ Please do not use this to send documents, luggage, or any
            personal items.
          </strong>
        </p>
      </div>

      {selectedDate && (
        <div className="mt-10 max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-900 tracking-tight">
            <span className="text-[#2463EB]">Companions</span> on{" "}
            {new Date(selectedDate).toDateString()}
          </h2>

          {companions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {companions.map((c) => (
                <div
                  key={c.$id}
                  className="p-5 border border-gray-300 rounded-xl bg-white shadow-sm hover:shadow-md transition"
                >
                  <p className="text-base font-bold text-gray-800 mb-1">
                    {c.fromLocation} → {c.toLocation}
                    {c.transitAirport && (
                      <span className="text-sm font-medium text-gray-500">
                        {" "}
                        (via {c.transitAirport.toUpperCase()})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-700">
                    {c.description || "No details provided."}
                  </p>
                  <p className="text-sm font-semibold mt-3">
                    Contact:{" "}
                    <a
                      href={`tel:${c.contact}`}
                      className="text-[#2563eb] hover:underline"
                    >
                      {c.contact || "Not provided"}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No companions available on this date.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default TravelCalendar;
