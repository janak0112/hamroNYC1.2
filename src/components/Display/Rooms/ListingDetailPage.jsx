import React, { useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
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

export default function ListingDetailPage() {
  const { id } = useParams(); // Get the room ID from the URL
  const { rooms, loading, error, fetchRooms } = useContext(DataContext);

  // Find the room by ID
  const room = rooms.find((r) => r.$id === id);

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
  if (!room)
    return <p className="text-center p-8">Room not found.</p>;

  // Map Appwrite room data to listing structure
  const listing = {
    id: room.$id,
    title: room.title,
    price: room.price || 0, // Fallback for null price
    location: room.location,
    date: new Date(room.$createdAt).toISOString().split("T")[0], // Format createdAt as YYYY-MM-DD
    views: 0, // Appwrite document doesn't provide views, use 0 or fetch from another source
    type: "room",
    images: [ImgApt, ImgApt, ImgApt], // Placeholder images (adjust if using Appwrite bucket)
    specs: {
      bedrooms: room.bedrooms || "N/A", // Fallback for null
      bathrooms: room.bathrooms || "N/A", // Fallback for null
      area: "N/A", // Not provided in document
      moveIn: new Date(room.availableFrom).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }), // Format availableFrom
      period: "N/A", // Not provided in document
      utilities: room.utilitiesIncluded ? 1 : 0, // Map boolean to 0/1
      deposit: 0, // Not provided, use 0 or adjust
      canCook: true, // Not provided, assuming true (adjust as needed)
    },
    description: room.description.split(". ").filter(Boolean), // Split into array by sentence
    contact: {
      name: room.user || "Unknown User",
      phone: room.contact,
      avatar: userPic, // Placeholder avatar
    },
  };

  // State for image gallery
  const [active, setActive] = useState(0);
  const changeSlide = useCallback((i) => setActive(i), []);

  // Helper formatter for currency
  const usd = (n) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <section
      className="max-w-7xl mx-auto p-4 md:p-8"
      data-testid="listing-detail"
    >
      {/* Headline */}
      <header className="mb-4 flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {listing.title}
        </h1>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <MapPin size={14} /> {listing.location}
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Views {listing.views}</span>
          <span className="hidden sm:inline">· Date {listing.date}</span>
        </div>
      </header>

      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        {/* ── GALLERY ─────────────────────────────────────────────────────── */}
        <div>
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
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {listing.images.map((src, i) => (
              <button
                key={i}
                onClick={() => changeSlide(i)}
                className={`h-16 aspect-video rounded-lg overflow-hidden transition ring-offset-2 ${
                  i === active
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
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside className="bg-white rounded-lg shadow p-4 space-y-4 h-fit">
          <div>
            <p className="text-2xl font-extrabold text-custom-primary">$
              {usd(listing.price)}
              <span className="ml-1 text-base font-normal text-gray-600">
                FOR RENT
              </span>
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md py-2 text-sm font-semibold transition">
            <Phone size={16} /> Call
          </button>

          <ul className="text-sm text-gray-700 divide-y divide-gray-100">
            <li className="flex justify-between py-1">
              <span className="flex items-center gap-1">
                <BedDouble size={14} />
                Bedrooms
              </span>
              <span>{listing.specs.bedrooms} Beds</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="flex items-center gap-1">
                <Bath size={14} />
                Bathrooms
              </span>
              <span>{listing.specs.bathrooms} Bath</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="flex items-center gap-1">Area</span>
              <span>{listing.specs.area} ft²</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="flex items-center gap-1">
                <CalendarClock size={14} />
                Move-in
              </span>
              <span>{listing.specs.moveIn}</span>
            </li>
            <li className="flex justify-between py-1">
              <span>Deposit</span>
              <span>{usd(listing.specs.deposit)}</span>
            </li>
            {listing.specs.canCook && (
              <li className="flex justify-between py-1">
                <span className="flex items-center gap-1">
                  <DoorOpen size={14} />
                  Kitchen
                </span>
                <span>Allowed</span>
              </li>
            )}
          </ul>
        </aside>
      </div>

      {/* ── DESCRIPTION ────────────────────────────────────────────────────── */}
      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">Detailed description</h2>
        {listing.description.map((line, i) => (
          <p key={i} className="text-gray-800 leading-relaxed">
            {line}
          </p>
        ))}
      </section>

      {/* ── CONTACT INFO / FOOTER ───────────────────────────────────────────── */}
      <aside className="mt-10 grid md:grid-cols-[1fr_250px] gap-8">
        {/* Placeholder for comments / ads */}
        <div className="space-y-4" />

        {/* Contact card */}
        <div className="bg-white shadow rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-700">Contact INFO</h3>
          <div className="flex items-center gap-3">
            <img
              src={listing.contact.avatar}
              alt={listing.contact.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-800">
                {listing.contact.name}
              </p>
              <p className="font-medium text-gray-800">
                {listing.contact.phone}
              </p>
            </div>
          </div>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 rounded-md font-semibold transition">
            Inquiry
          </button>
        </div>
      </aside>
    </section>
  );
}