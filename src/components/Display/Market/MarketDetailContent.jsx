import React from "react";
import {
  Phone,
  MapPin,
  CalendarClock,
  CheckCircle,
  User,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import MarketImg from "../../../assets/img/no-image.png";

const ACCENT = "#CD4A3D";

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

  const postedBy =
    (item.postedByName && formatName(item.postedByName)) ||
    item.email ||
    "Anonymous User";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero Image */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="aspect-[16/7] w-full bg-gray-50">
          <img
            src={imageUrl || MarketImg}
            alt={item.title}
            onError={(e) => {
              e.currentTarget.src = MarketImg;
            }}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {item.title}
      </h1>

      {/* Meta Info */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <MapPin size={16} />
          {item.location || "Unknown location"}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock size={16} />
          Posted on:{" "}
          {new Date(item.$createdAt).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Item Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Condition */}
          {item.condition && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-green-700">
              <CheckCircle size={20} />
              <span className="text-base font-medium">{item.condition}</span>
            </div>
          )}
        </div>

        {/* Right Column - Sticky Info Card */}
        <aside
          className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          {/* Price */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {item.price ? `$${item.price.toLocaleString()}` : "Not specified"}
            </p>
          </div>

          {/* Category */}
          {item.type && (
            <div className="mb-5">
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1 flex items-center gap-2 text-gray-800">
                <Tag size={16} className="text-gray-500" />
                {item.type}
              </p>
            </div>
          )}

          {/* Contact */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            {item.contact ? (
              <p className="mt-1 flex items-center gap-2 text-gray-800">
                <Phone size={16} className="text-gray-500" />
                {item.contact}
              </p>
            ) : (
              <p className="mt-1 text-gray-500">No contact info available.</p>
            )}
          </div>

          {/* Posted By */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Posted By</h3>
            <p className="mt-1 flex items-center gap-2 text-gray-800">
              <User size={16} className="text-blue-500" />
              <span className="font-medium">{postedBy}</span>
            </p>
          </div>

          {/* Message Seller */}
          <Link
            to="/message"
            className="block w-full rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
            style={{ ["--accent"]: ACCENT }}
          >
            Message Seller
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default MarketDetailContent;
