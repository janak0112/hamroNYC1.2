// components/MarketDetailContent.jsx
import React from "react";
import { Phone, MapPin, CalendarClock, CheckCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import MarketImg from "../../../assets/img/no-image.png";

const MarketDetailContent = ({ item, imageUrl }) => {
  const formatName = (name) =>
    name
      ? name
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "";

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Hero Image */}
      {imageUrl ? (
        <div className="w-full mb-8">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full max-h-[400px] object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : null}

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        {item.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Location & Posted Date */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="font-medium">
                {item.location || "Unknown location"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock size={18} />
              <span>
                Posted on:{" "}
                {new Date(item.$createdAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">
              Item Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Condition */}
          {item.condition && (
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-lg">{item.condition}</span>
            </div>
          )}
        </div>

        {/* Right Column (Sticky Info Card) */}
        <div className="bg-white shadow-xl border rounded-xl p-6 sticky top-6 h-fit space-y-6">
          {/* Price */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Price</h3>
            <p className="text-3xl font-bold text-green-600">
              {item.price ? `$${item.price.toLocaleString()}` : "Not specified"}
            </p>
          </div>

          {/* Category */}
          {item.type && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Category</h3>
              <p className="text-gray-700">{item.type}</p>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Contact Information
            </h3>
            {item.contact ? (
              <div className="flex items-center gap-2 mt-2 text-gray-700">
                <Phone size={18} />
                <span>{item.contact}</span>
              </div>
            ) : (
              <p className="text-gray-500">No contact info available.</p>
            )}
          </div>

          {/* Posted By */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Posted By</h3>
            <div className="flex items-center gap-2 mt-2 text-gray-700">
              <User size={18} className="text-blue-500" />
              <span className="font-medium">
                {(item.postedBy &&
                  formatName(JSON.parse(item.postedBy).name)) ||
                  item.email ||
                  "Anonymous User"}
              </span>
            </div>
          </div>

          {/* Message Seller Button */}
          <Link
            to="/message"
            className="w-full py-3 text-center text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-md block transition"
          >
            Message Seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailContent;
