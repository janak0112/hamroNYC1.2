import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Globe,
  Ticket,
} from "lucide-react";

function EventDetailContent({ event, imageUrl }) {
  const imageUrls = Array.isArray(imageUrl) ? imageUrl : [];

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
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Image */}
      {imageUrls.length > 0 && (
        <div className="w-full mb-8">
          <img
            src={imageUrls[0].trim()}
            alt={event.title}
            className="w-full max-h-[300px] object-contain mx-auto bg-gray-100 rounded-xl shadow-md"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
        {event.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Mode */}
          <span
            className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
              event.eventMode === "online"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {event.eventMode === "online" ? "Online Event" : "In-Person Event"}
          </span>

          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date not provided"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>
                {event.eventTime
                  ? new Date(
                      `1970-01-01T${event.eventTime}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Time not provided"}
              </span>
            </div>
          </div>

          {/* Location / Link */}
          {event.eventMode === "inPerson" && event.location && (
            <div className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
          {event.eventMode === "online" && event.onlineLink && (
            <div>
              <a
                href={event.onlineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 font-medium hover:underline"
              >
                <Globe size={20} className="mr-2" />
                Join Online Event
              </a>
            </div>
          )}

          {/* Ticket Info */}
          <div>
            <div className="flex items-center gap-2 text-gray-800">
              <Ticket size={20} />
              <span className="font-medium">
                {event.ticketOption === "free"
                  ? "Free Entry"
                  : event.ticketOption === "paid"
                  ? `Paid Event - $${event.ticketCost}`
                  : "Ticket info not provided"}
              </span>
            </div>
            {event.ticketLink && (
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-5 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
              >
                Register / Get Ticket
              </a>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Event Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-[1.05rem]">
              {event.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white shadow-xl border rounded-xl p-6 sticky top-6 space-y-6 h-fit">
          <h3 className="text-xl font-bold text-gray-800">Contact Info</h3>

          {event.contact ? (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone size={18} />
              <span>{event.contact}</span>
            </div>
          ) : (
            <p className="text-gray-500">No contact info provided.</p>
          )}

          {event.email && (
            <div>
              <a
                href={`mailto:${event.email}`}
                className="text-blue-500 hover:underline font-medium"
              >
                {event.email}
              </a>
            </div>
          )}

          {event.postedBy && (
            <p className="text-sm text-gray-500">
              Posted by:{" "}
              <span className="font-medium text-gray-800">
                {formatName(JSON.parse(event.postedBy).name)}
              </span>
            </p>
          )}

          {/* CTA Button */}
          <a
            href={event.ticketLink || "#"}
            target={event.ticketLink ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="w-full py-3 text-center text-white font-semibold rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 block transition"
          >
            {event.ticketLink ? "Register Now" : "No Ticket Link"}
          </a>
        </div>
      </div>
    </div>
  );
}

export default EventDetailContent;
