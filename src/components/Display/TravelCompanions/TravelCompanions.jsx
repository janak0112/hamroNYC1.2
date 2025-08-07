// TravelCompanions.jsx
import React from "react";
import TravelCalendar from "./TravelCalendar";
import LookingTable from "./LookingTable";
import "./Calender.css";

const TravelCompanions = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight">
        <span className="block">Find or Offer</span>
        <span className="block text-[#2463EB]">Travel Companion</span>
      </h1>

      <div className="mb-12">
        <TravelCalendar />
      </div>

      <div>
        <LookingTable />
      </div>
    </div>
  );
};

export default TravelCompanions;
