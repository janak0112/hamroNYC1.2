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
        <button onClick={fetchRooms} className="ml-2 text-blue-500 underline">
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
            ></div>
          );
        })}
      </div>
    </section>
  );
}
