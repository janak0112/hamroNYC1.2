// components/MarketDetailContent.jsx
import React, { useState } from "react";
import { Phone, MapPin, CalendarClock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import MarketImg from "../../../assets/img/market-item.png";

const MarketDetailContent = ({ item, imageUrl }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
            <MapPin size={16} />
            <span>{item.location || "Unknown location"}</span>
            <CalendarClock size={16} />
            <span>{new Date(item.$createdAt).toLocaleDateString()}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Item Description</h3>
            <p className="mt-2">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Static Image Section (can be updated for dynamic images) */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Item Image</h3>
            <div className="mt-4">
              {imageUrl && (
                <img src={imageUrl} alt={item.title} className="mb-4" />
              )}
            </div>
          </div>

          {/* Condition */}
          {item.condition && (
            <div className="mt-6 flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-lg">{item.condition}</span>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Price</h3>
            <p className="text-lg font-bold">
              {item.price ? `$${item.price.toLocaleString()}` : "Not specified"}
            </p>
          </div>

          {item.type && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Category</h3>
              <p className="text-gray-800">{item.type}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            {item.contact ? (
              <div className="flex items-center space-x-2 mt-2">
                <Phone size={16} />
                <span>{item.contact}</span>
              </div>
            ) : (
              <p className="text-gray-500">No contact info available.</p>
            )}
          </div>

          <Link
            to="/message"
            className="w-full py-2 text-center text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 block"
          >
            Message Seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailContent;
