import React, { useState, useCallback, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ImgApt from "../../../assets/img/no-image.jpg"; // fallback image
import { getImageUrls } from "../../../utils/uploadFile";

export default function JobList() {
    const { jobs, loading, error } = useContext(DataContext);
    const [activeImages, setActiveImages] = useState({});

    const changeSlide = useCallback((eventId, index) => {
        setActiveImages((prev) => ({ ...prev, [eventId]: index }));
    }, []);

    if (loading) return <p className="text-center p-8">Loading...</p>;
    if (error) return <p className="text-center p-8 text-red-500">Error: {error}</p>;
    if (!jobs || jobs.length === 0)
        return <p className="text-center p-8">No jobs available.</p>;

    return (
        <section className="max-w-7xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl md:text-3xl font-bold text-gray-800 mb-6">
                All jobs
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {jobs.map((event) => {
                    const active = activeImages[event.$id] || 0;

                    const images = event.imageIds?.length
                        ? getImageUrls(event.imageIds)
                        : [ImgApt];

                    return (
                        <div
                            key={event.$id}
                            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all"
                        >
                            {/* Event Header */}
                            <header className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {event.title}
                                </h2>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <MapPin size={14} /> {event.location}
                                </div>
                            </header>

                            {/* Image Gallery */}
                            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={images[active]}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                                    {active + 1}/{images.length}
                                </span>
                            </div>
                            <div className="flex gap-2 p-3 overflow-x-auto">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => changeSlide(event.$id, i)}
                                        className={`h-12 aspect-video rounded-lg overflow-hidden transition ring-offset-2 ${i === active
                                                ? "ring-2 ring-custom-primary"
                                                : "opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={src}
                                            alt="thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Event Details */}
                            <div className="p-4 space-y-3">
                                <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <li className="flex justify-between py-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> Date
                                        </span>
                                        <span>
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </span>
                                    </li>
                                    <li className="flex justify-between py-1">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> Time
                                        </span>
                                        <span>
                                            {new Date(event.eventTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </li>
                                    <li className="flex justify-between py-1">
                                        <span>Contact</span>
                                        <span>{event.contact}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Description */}
                            <div className="p-4 border-t border-gray-100">
                                <h3 className="text-sm font-semibold mb-2">Description</h3>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* View More Button */}
                            <div className="p-4 border-t border-gray-100">
                                <Link
                                    to={`/jobs/${event.$id}`}
                                    className="w-full flex items-center justify-center bg-[rgba(212,17,56,1)] hover:bg-[rgba(180,15,48,1)] text-white rounded-md py-2 text-sm font-semibold transition"
                                >
                                    View More
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
