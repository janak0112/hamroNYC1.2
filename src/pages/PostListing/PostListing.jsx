import React from "react";
import { useNavigate } from "react-router-dom";
import { House, BriefcaseBusiness, ShoppingCart, CalendarDays,Plane } from 'lucide-react';

const AddPostPage = () => {
  const navigate = useNavigate();

  const handlePostTypeSelection = (type) => {
    // Redirect to the corresponding post form based on selected category
    switch (type) {
      case "room":
        navigate("/add-room"); // Navigate to room post form
        break;
      case "job":
        navigate("/add-job"); // Navigate to job post form
        break;
      case "market":
        navigate("/add-market"); // Navigate to market post form
        break;
      case "event":
        navigate("/add-event"); // Navigate to event post form
        break;
      case "travel companions":
        navigate("/add-travel-companions"); // Navigate to event post form
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="heading-primary text-3xl font-bold text-center mb-6 heading-primary">
        Choose a Category to Add a Post
      </h2>

      <div className="grid grid-cols-2 gap-10 justify-center">
        {/* Room Option */}
        <div
          className="flex items-center justify-center p-6 border border border-[rgba(212,17,56,1)] rounded-md cursor-pointer hover:bg-[rgba(212,17,56,0.1)] transition"
          onClick={() => handlePostTypeSelection("room")}
        >
          <div className="flex gap-4 align-middle">
            <House width={60} height={60} className="text-[rgba(212,17,56,1)]" />
            <div className="flex flex-col align-middle justify-center">
              <h3 className="text-lg font-semibold">Room</h3>
              <p className="text-sm text-gray-500">Post a room listing</p>
            </div>
          </div>
        </div>

        {/* Job Option */}
        <div
          className="flex items-center justify-center p-6 border border-[rgba(212,17,56,1)] rounded-md cursor-pointer hover:bg-[rgba(212,17,56,0.1)] transition"
          onClick={() => handlePostTypeSelection("job")}
        >
          <div className="flex gap-4 align-middle">
            <BriefcaseBusiness width={60} height={60} className="text-[rgba(212,17,56,1)]" />
            <div className="flex flex-col align-middle justify-center">
              <h3 className="text-lg font-semibold">Job</h3>
              <p className="text-sm text-gray-500">Post a job listing</p>
            </div></div>
        </div>

        {/* Market Option */}
        <div
          className="flex items-center justify-center p-6 border border border-[rgba(212,17,56,1)] rounded-md cursor-pointer hover:bg-[rgba(212,17,56,0.1)] transition"
          onClick={() => handlePostTypeSelection("market")}
        >
          <div className="flex gap-4 align-middle">
            <ShoppingCart width={60} height={60} className="text-[rgba(212,17,56,1)]" />
            <div className="flex flex-col align-middle justify-center">
              <h3 className="text-lg font-semibold">Market</h3>
              <p className="text-sm text-gray-500">Post an item for sale</p>
            </div>
          </div>
        </div>

        {/* Event Option */}
        <div
          className="flex items-center justify-center p-6 border border border-[rgba(212,17,56,1)] rounded-md cursor-pointer hover:bg-[rgba(212,17,56,0.1)] transition"
          onClick={() => handlePostTypeSelection("event")}
        >
          <div className="flex gap-4 align-middle">
            <CalendarDays width={60} height={60} className="text-[rgba(212,17,56,1)]" />
            <div className="flex flex-col align-middle justify-center">
              <h3 className="text-lg font-semibold">Event</h3>
              <p className="text-sm text-gray-500">Post an event</p>
            </div>
          </div>
        </div>

        {/* Travel Option */}
        <div
          className="flex items-center justify-center p-6 border border border-[rgba(212,17,56,1)] rounded-md cursor-pointer hover:bg-[rgba(212,17,56,0.1)] transition"
          onClick={() => handlePostTypeSelection("event")}
        >
          <div className="flex gap-4 align-middle">
            <Plane width={60} height={60} className="text-[rgba(212,17,56,1)]" />
            <div className="flex flex-col align-middle justify-center">
              <h3 className="text-lg font-semibold">Travel Companions</h3>
              <p className="text-sm text-gray-500">Post Travel Companions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;
