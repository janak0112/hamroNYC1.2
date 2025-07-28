import React from "react";
import { useNavigate } from "react-router-dom";

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
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Choose a Category to Add a Post
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Room Option */}
        <div
          className="flex items-center justify-center p-6 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={() => handlePostTypeSelection("room")}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold">Room</h3>
            <p className="text-sm text-gray-500">Post a room listing</p>
          </div>
        </div>

        {/* Job Option */}
        <div
          className="flex items-center justify-center p-6 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={() => handlePostTypeSelection("job")}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold">Job</h3>
            <p className="text-sm text-gray-500">Post a job listing</p>
          </div>
        </div>

        {/* Market Option */}
        <div
          className="flex items-center justify-center p-6 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={() => handlePostTypeSelection("market")}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold">Market</h3>
            <p className="text-sm text-gray-500">Post an item for sale</p>
          </div>
        </div>

        {/* Event Option */}
        <div
          className="flex items-center justify-center p-6 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={() => handlePostTypeSelection("event")}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold">Event</h3>
            <p className="text-sm text-gray-500">Post an event</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;
