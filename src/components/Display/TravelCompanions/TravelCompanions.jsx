import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import listingService from "../../appwrite/config";
// import conf from "../../conf/conf";

const TravelCompanions = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [datesWithCounts, setDatesWithCounts] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [companions, setCompanions] = useState([]);

  // Fetch and group travel listings
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!from || !to) return;
  //     try {
  //       const response = await listingService.getTravelListings();

  //       const filtered = response.filter(
  //         (item) =>
  //           item.fromLocation?.toLowerCase() === from.toLowerCase() &&
  //           item.toLocation?.toLowerCase() === to.toLowerCase()
  //       );

  //       const grouped = {};
  //       filtered.forEach((item) => {
  //         const date = new Date(item.dateOfTravel).toDateString();
  //         grouped[date] = (grouped[date] || 0) + 1;
  //       });

  //       setDatesWithCounts(grouped);
  //     } catch (error) {
  //       console.error("Error loading travel companions:", error);
  //     }
  //   };
  //   fetchData();
  // }, [from, to]);

  const handleDateClick = async (date) => {
    // const selected = date.toDateString();
    // setSelectedDate(selected);
    // try {
    //   const all = await listingService.getTravelListings();
    //   const list = all.filter(
    //     (item) =>
    //       item.fromLocation?.toLowerCase() === from.toLowerCase() &&
    //       item.toLocation?.toLowerCase() === to.toLowerCase() &&
    //       new Date(item.dateOfTravel).toDateString() === selected
    //   );
    //   setCompanions(list);
    // } catch (error) {
    //   console.error("Error fetching companions for date:", error);
    // }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Find a Travel Companion
      </h1>

      {/* From / To Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            From Airport
          </label>
          <input
            type="text"
            placeholder="e.g. JFK"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#CD4A3D] focus:outline-none"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            To Airport
          </label>
          <input
            type="text"
            placeholder="e.g. KTM"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#CD4A3D] focus:outline-none"
          />
        </div>
      </div>

      {/* Calendar */}
      {from && to ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <Calendar
            onClickDay={handleDateClick}
            className="rounded-lg shadow-sm p-4 w-full"
            tileContent={({ date }) => {
              const count = datesWithCounts[date.toDateString()];
              return count ? (
                <div className="flex justify-center items-center mt-1">
                  <span className="bg-[#CD4A3D] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                </div>
              ) : null;
            }}
            tileClassName={({ date }) =>
              selectedDate === date.toDateString()
                ? "bg-[#CD4A3D] text-white rounded-lg"
                : "hover:bg-gray-100 rounded-lg"
            }
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Select From and To airports to see available companions.
        </p>
      )}

      {/* Companion List */}
      {selectedDate && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Companions on {selectedDate}:
          </h2>
          {companions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {companions.map((c) => (
                <div
                  key={c.$id}
                  className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold text-[#CD4A3D]">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {c.fromLocation} → {c.toLocation}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{c.description}</p>
                  <p className="text-sm font-medium mt-2">
                    Contact: {c.contact || "Not provided"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No companions available.</p>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-gray-500 text-center">
        ⚠️ Please verify your phone number to post a listing. Contact info is
        only visible if provided by the poster.
      </p>
    </div>
  );
};

export default TravelCompanions;
