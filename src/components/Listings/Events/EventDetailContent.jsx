import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";
import Fancybox from "../../FancyBox/fancyBox";

function EventDetailContent({ event, imageUrl }) {
    // Ensure imageUrl is always an array
    const imageUrls = Array.isArray(imageUrl) ? imageUrl : [];

    return (
        <div className="container mx-auto p-6">
            {/* Image Gallery */}
            {imageUrls.length > 0 && (
                <Fancybox options={{ Carousel: { infinite: false } }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {imageUrls.map((url, index) => (
                            <a
                                key={index}
                                href={url.trim()}
                                data-fancybox="gallery"
                                data-caption={`${event.title} - ${index + 1}`}
                                className="block"
                            >
                                <img
                                    src={url.trim()}
                                    alt={`${event.title} - ${index + 1}`}
                                    className="w-full rounded-lg shadow cursor-pointer object-cover h-80"
                                />
                            </a>
                        ))}
                    </div>
                </Fancybox>
            )}

            {/* Event Title */}
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2">
                    <div className="flex items-center space-x-4 text-gray-600">
                        <MapPin size={18} />
                        <span>{event.location || "Unknown location"}</span>
                    </div>

                    <div className="flex items-center space-x-4 mt-2 text-gray-600">
                        <Calendar size={18} />
                        <span>
                            {event.eventDate
                                ? new Date(event.eventDate).toLocaleDateString()
                                : "No date provided"}
                        </span>
                        <Clock size={18} />
                        <span>
                            {event.eventTime
                                ? new Date(event.eventTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "No time provided"}
                        </span>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-2xl font-semibold">Event Description</h3>
                        <p className="mt-2">
                            {event.description || "No description provided."}
                        </p>
                    </div>

                    {event.checkOnly && (
                        <div className="mt-6 flex items-center space-x-2">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="text-lg">Check Only</span>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="bg-white shadow-md p-6 rounded-md">
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Contact Info</h3>
                        {event.contact ? (
                            <div className="flex items-center space-x-2 mt-2">
                                <Phone size={16} />
                                <span>{event.contact}</span>
                            </div>
                        ) : (
                            <p className="text-gray-500">No contact info provided</p>
                        )}
                        {event.email && (
                            <div className="mt-2">
                                <a href={`mailto:${event.email}`} className="text-blue-500">
                                    {event.email}
                                </a>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Posted by:{" "}
                        <span className="font-medium text-gray-700">{event.userId}</span>
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

export default EventDetailContent;
