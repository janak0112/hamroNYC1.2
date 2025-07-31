import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, CalendarClock, CheckCircle } from "lucide-react";
import Fancybox from "../../FancyBox/fancyBox";

function RoomDetailContent({ room, imageUrl }) {
  // Split the comma-separated URLs into an array
   // Ensure imageUrl is an array
//    console.log("imageUrl",imageUrl)
   const imageUrls = Array.isArray(imageUrl) ? imageUrl : [];

//   console.log("imageUrls:", imageUrls);


return (
    <div className="container mx-auto px-6 py-20 content-wrapper">
      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <Fancybox options={{ Carousel: { infinite: false } }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                  className="w-full rounded-lg shadow cursor-pointer object-cover h-80"
                />
              </a>
            ))}
          </div>
        </Fancybox>
      )}
  
      <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2">
          <div className="flex items-center space-x-2 text-gray-500 mb-4">
            <MapPin size={16} />
            <span>{room.location || "Unknown location"}</span>
            <CalendarClock size={16} />
            <span>{new Date(room.$createdAt).toLocaleDateString()}</span>
          </div>
  
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Description</h3>
            <p>{room.description || "No description provided."}</p>
          </div>
  
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-5">Details</h3>
            <div className="overflow-x-auto">
  <table className="w-full border border-gray-300 rounded-lg shadow-md">
    <tbody>
      <tr>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Room Type</th>
        <td className="py-4 px-4 border-b">{room.type}</td>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Available From</th>
        <td className="py-4 px-4 border-b">
          {new Date(room.availableFrom).toDateString()}
        </td>
      </tr>

      <tr>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Studio</th>
        <td className="py-4 px-4 border-b">{room.isStudio ? "Yes" : "No"}</td>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Utilities Included</th>
        <td className="py-4 px-4 border-b">{room.utilitiesIncluded ? "Yes" : "No"}</td>
      </tr>

      <tr>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Furnishing</th>
        <td className="py-4 px-4 border-b">{room.furnishing ? "Yes" : "No"}</td>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Bedrooms</th>
        <td className="py-4 px-4 border-b">{room.bedrooms ?? "Not specified"}</td>
      </tr>

      <tr>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Bathrooms</th>
        <td className="py-4 px-4 border-b">{room.bathrooms ?? "Not specified"}</td>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Price</th>
        <td className="py-4 px-4 border-b">${room.price}</td>
      </tr>

      <tr>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Published</th>
        <td className="py-4 px-4 border-b">{room.publish ? "Yes" : "No"}</td>
        <th className="text-left py-4 px-4 border-b bg-gray-100">Contact</th>
        <td className="py-4 px-4 border-b">{room.contact}</td>
      </tr>
    </tbody>
  </table>
</div>

          </div>
  
        </div>
  
        {/* Right Column */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Price</h3>
            <p className="text-lg font-bold">${room.price || "Not specified"}</p>
          </div>
  
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            {room.contact && (
              <div className="flex items-center space-x-2 mt-2">
                <Phone size={16} />
                <span>{room.contact}</span>
              </div>
            )}
            {room.email && (
              <div className="mt-2">
                <a href={`mailto:${room.email}`} className="text-blue-500">
                  {room.email}
                </a>
              </div>
            )}
          </div>
  
          <p className="text-sm text-gray-500 mt-2">
            Posted by: <span className="font-medium text-gray-700">{room.user}</span>
          </p>
  
          <Link
            to="/apply"
            className="w-full py-2 mt-4 text-center text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 block"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
  
}

export default RoomDetailContent;
