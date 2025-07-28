import React, { useState, useCallback, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import {
    Phone,
    MapPin,
    BedDouble,
    Bath,
    CalendarClock,
    DoorOpen,
} from "lucide-react";
import ImgApt from "../../../assets/img/apt-kitchen.png";
import userPic from "../../../assets/img/user-pic.png";
import { Link } from "react-router";

export default function RoomList() {
    const { rooms, loading, error, fetchRooms } = useContext(DataContext);

    // State for image gallery (per room)
    const [activeImages, setActiveImages] = useState({});

    // Helper to change slide for a specific room
    const changeSlide = useCallback((roomId, index) => {
        setActiveImages((prev) => ({ ...prev, [roomId]: index }));
    }, []);

    // Helper formatter for currency
    const usd = (n) =>
        n.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        });

    // Handle loading and error states
    if (loading) return <p className="text-center p-8">Loading...</p>;
    if (error)
        return (
            <p className="text-center p-8 text-red-500">
                Error: {error}{" "}
                <button
                    onClick={fetchRooms}
                    className="ml-2 text-blue-500 underline"
                >
                    Retry
                </button>
            </p>
        );
    if (rooms.length === 0)
        return <p className="text-center p-8">No rooms available.</p>;

    return (
        <section
            className="max-w-7xl mx-auto p-4 md:p-8"
            data-testid="listing-detail"
        >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                All Rooms
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {rooms.map((room) => {
                    // Map Appwrite room data to listing structure
                    const listing = {
                        id: room.$id,
                        title: room.title,
                        price: room.price || 0,
                        location: room.location,
                        date: new Date(room.$createdAt).toISOString().split("T")[0],
                        views: 0,
                        type: "room",
                        images: [ImgApt, ImgApt, ImgApt],
                        specs: {
                            bedrooms: room.bedrooms || "N/A",
                            bathrooms: room.bathrooms || "N/A",
                            area: "N/A",
                            moveIn: new Date(room.availableFrom).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }),
                            period: "N/A",
                            utilities: room.utilitiesIncluded ? 1 : 0,
                            deposit: 0,
                            canCook: true,
                        },
                        description: room.description.split(". ").filter(Boolean),
                        contact: {
                            name: room.user || "Unknown User",
                            phone: room.contact,
                            avatar: userPic,
                        },
                    };

                    const active = activeImages[room.$id] || 0;

                    return (
                        <div
                            key={room.$id}
                            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all"
                        >
                            {/* Headline */}
                            <header className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {listing.title}
                                </h2>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <MapPin size={14} /> {listing.location}
                                </div>
                            </header>

                            {/* Gallery */}
                            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={listing.images[active]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                                    {active + 1}/{listing.images.length}
                                </span>
                            </div>
                            <div className="flex gap-2 p-3 overflow-x-auto">
                                {listing.images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => changeSlide(room.$id, i)}
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

                            {/* Sidebar Info */}
                            <div className="p-4 space-y-3">
                                <p className="text-xl font-extrabold text-custom-primary">
                                    {usd(listing.price)}
                                    <span className="ml-1 text-sm font-normal text-gray-600">
                                        FOR RENT
                                    </span>
                                </p>
                                <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                                    {listing.specs.bedrooms !== "N/A" && (
                                        <li className="flex justify-between py-1">
                                            <span className="flex items-center gap-1">
                                                <BedDouble size={14} />
                                                Bedrooms
                                            </span>
                                            <span>{listing.specs.bedrooms} Beds</span>
                                        </li>
                                    )}
                                    {listing.specs.bathrooms !== "N/A" && (
                                        <li className="flex justify-between py-1">
                                            <span className="flex items-center gap-1">
                                                <Bath size={14} />
                                                Bathrooms
                                            </span>
                                            <span>{listing.specs.bathrooms} Bath</span>
                                        </li>
                                    )}
                                    <li className="flex justify-between py-1">
                                        <span className="flex items-center gap-1">
                                            <CalendarClock size={14} />
                                            Move-in
                                        </span>
                                        <span>{listing.specs.moveIn}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Description */}
                            <div className="p-4 border-t border-gray-100">
                                <h3 className="text-sm font-semibold mb-2">Description</h3>
                                {listing.description.map((line, i) => (
                                    <p key={i} className="text-sm text-gray-800 leading-relaxed">
                                        {line}
                                    </p>
                                ))}
                            </div>


                            <div className="p-4 border-t border-gray-100">
                                <Link
                                    to={`/rooms/${room.$id}`}
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