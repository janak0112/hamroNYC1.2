import React from "react";
import { Phone, MapPin, Calendar, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function EventDetailPage() {
  const { id } = useParams(); // This will retrieve the 'id' from the URL
  console.log(id);
  const event = {
    title: "Annual Networking Conference 2025",
    organizer: "Tech Innovators Network",
    location: "Convention Center, New York, NY",
    date: "2025-09-15",
    time: "9:00 AM - 5:00 PM",
    price: "$100",
    description:
      "Join us for the Annual Networking Conference 2025, where tech professionals, entrepreneurs, and enthusiasts come together to discuss the latest trends in the industry. Enjoy keynote speeches, panel discussions, and networking opportunities.",
    registrationLink: "https://example.com/register",
    contactPhone: "(123) 456-7890",
    contactEmail: "events@techinnovators.com",
    address: "123 Convention Center, New York, NY",

    isFree: false, // Event is not free
    foodAndBeverages: true, // Food and beverages available
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Event Information) */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <h2 className="text-xl text-gray-600">
            Organized by: {event.organizer}
          </h2>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
            <MapPin size={16} />
            <span>{event.location}</span>
            <Calendar size={16} />
            <span>{event.date}</span>
            <span className="mx-2">|</span>
            <span>{event.time}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Event Description</h3>
            <p className="mt-2">{event.description}</p>
          </div>

          {/* Event Features (e.g., Free, Food & Beverages) */}
          <div className="mt-6">
            {!event.isFree && (
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-lg">Ticket Price: {event.price}</span>
              </div>
            )}
            {event.foodAndBeverages && (
              <div className="mt-4 flex items-center space-x-2">
                <CheckCircle size={20} className="text-blue-500" />
                <span className="text-lg">Food and Beverages Available</span>
              </div>
            )}
          </div>

          {/* Add map link */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Location</h3>
            <div className="mt-2">
              <p>{event.address}</p>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar with Contact Info & Registration) */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Price</h3>
            <p className="text-lg font-bold">
              {event.isFree ? "Free" : event.price}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            <div className="flex items-center space-x-2 mt-2">
              <Phone size={16} />
              <span>{event.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <a
                href={`mailto:${event.contactEmail}`}
                className="text-blue-500"
              >
                {event.contactEmail}
              </a>
            </div>
          </div>

          <Link
            to={event.registrationLink}
            className="w-full py-2 text-center text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
