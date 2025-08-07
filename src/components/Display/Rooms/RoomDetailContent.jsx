import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, CalendarClock } from "lucide-react";
import Fancybox from "../../FancyBox/fancyBox";

function RoomDetailContent({ room, imageUrl }) {
  const formatName = (name) =>
    name
      ? name
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "";

  const imageUrls = Array.isArray(imageUrl) ? imageUrl : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <Fancybox options={{ Carousel: { infinite: false } }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {imageUrls.map((url, index) => (
              <a
                key={index}
                href={url.trim()}
                data-fancybox="gallery"
                data-caption={`${room.title} - ${index + 1}`}
              >
                <img
                  src={url.trim()}
                  alt={`${room.title} - ${index + 1}`}
                  className="w-full h-64 object-contain bg-gray-100 rounded-xl shadow-sm p-2"
                />
              </a>
            ))}
          </div>
        </Fancybox>
      )}

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
        {room.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
        {/* Left Section */}
        <div className="col-span-2 space-y-8">
          {/* Location & Date */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{room.location || "Unknown location"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock size={18} />
              <span>
                Posted on:{" "}
                {new Date(room.$createdAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-[1.05rem]">
              {room.description || "No description provided."}
            </p>
          </div>

          {/* Room Details */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Room Details
            </h3>
            <div className="overflow-x-auto rounded-lg border shadow-md">
              <table className="w-full text-left text-sm">
                <tbody>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 font-medium">Room Type</th>
                    <td className="px-4 py-3">{room.type}</td>
                    <th className="px-4 py-3 font-medium">Available From</th>
                    <td className="px-4 py-3">
                      {new Date(room.availableFrom).toDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium bg-gray-50">Studio</th>
                    <td className="px-4 py-3">
                      {room.isStudio ? "Yes" : "No"}
                    </td>
                    <th className="px-4 py-3 font-medium bg-gray-50">
                      Utilities Included
                    </th>
                    <td className="px-4 py-3">
                      {room.utilitiesIncluded ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium">Furnishing</th>
                    <td className="px-4 py-3">
                      {room.furnishing ? "Yes" : "No"}
                    </td>
                    <th className="px-4 py-3 font-medium">Bedrooms</th>
                    <td className="px-4 py-3">
                      {room.bedrooms ?? "Not specified"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 font-medium">Bathrooms</th>
                    <td className="px-4 py-3">
                      {room.bathrooms ?? "Not specified"}
                    </td>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <td className="px-4 py-3">${room.price}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium bg-gray-50">
                      Published
                    </th>
                    <td className="px-4 py-3">{room.publish ? "Yes" : "No"}</td>
                    <th className="px-4 py-3 font-medium bg-gray-50">
                      Contact
                    </th>
                    <td className="px-4 py-3">{room.contact}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section (Contact Card) */}
        <div className="bg-white shadow-xl border rounded-xl p-6 sticky top-6 h-fit space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Price</h3>
            <p className="text-3xl font-bold text-green-600">
              {room.price ? `$${room.price.toLocaleString()}` : "Not specified"}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Contact Information
            </h3>
            {room.contact && (
              <div className="flex items-center gap-2 mt-2 text-gray-700">
                <Phone size={18} />
                <span>{room.contact}</span>
              </div>
            )}
            {room.email && (
              <div className="mt-2">
                <a
                  href={`mailto:${room.email}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {room.email}
                </a>
              </div>
            )}
          </div>

          {/* Posted By */}
          {room.postedBy && (
            <p className="text-sm text-gray-500">
              Posted by:{" "}
              <span className="font-medium text-gray-800">
                {formatName(JSON.parse(room.postedBy).name)}
              </span>
            </p>
          )}

          {/* Apply Now */}
          <Link
            to="/apply"
            className="w-full py-3 text-center text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-md block transition"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailContent;
