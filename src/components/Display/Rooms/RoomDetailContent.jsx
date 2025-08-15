import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  CalendarClock,
  BedDouble,
  Bath,
  Home,
  Zap,
  Sofa,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import Fancybox from "../../FancyBox/fancyBox";

const ACCENT = "#CD4A3D";

function RoomDetailContent({ room, imageUrl }) {
  const imageUrls = Array.isArray(imageUrl) ? imageUrl.filter(Boolean) : [];

  const formatName = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "";

  const dateLabel = room.$createdAt
    ? new Date(room.$createdAt).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const priceLabel =
    typeof room.price === "number"
      ? `$${room.price.toLocaleString()}`
      : room.price
      ? `$${Number(room.price).toLocaleString()}`
      : "Not specified";

  const chips = [
    { icon: MapPin, label: room.location || "Unknown location" },
    { icon: CalendarClock, label: `Posted on ${dateLabel}` },
  ];

  const facts = [
    { icon: Home, label: "Studio", value: room.isStudio ? "Yes" : "No" },
    {
      icon: BedDouble,
      label: "Bedrooms",
      value: room.bedrooms ?? "Not specified",
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: room.bathrooms ?? "Not specified",
    },
    {
      icon: Zap,
      label: "Utilities Included",
      value: room.utilitiesIncluded ? "Yes" : "No",
    },
    { icon: Sofa, label: "Furnished", value: room.furnishing ? "Yes" : "No" },
    {
      icon: MapPin,
      label: "Available From",
      value: room.availableFrom
        ? new Date(room.availableFrom).toDateString()
        : "TBD",
    },
  ];

  const share = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: room.title,
          text: "Check out this room on HamroNYC",
          url: typeof window !== "undefined" ? window.location.href : undefined,
        });
      }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Gallery */}
      {imageUrls.length > 0 && (
        <div
          className="relative mb-8 overflow-hidden rounded-3xl border border-gray-100 bg-white"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          <Fancybox options={{ Carousel: { infinite: false } }}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 p-2">
              {imageUrls.map((url, i) => (
                <a
                  key={i}
                  href={url.trim()}
                  data-fancybox="gallery"
                  data-caption={`${room.title} - ${i + 1}`}
                >
                  <img
                    src={url.trim()}
                    alt={`${room.title} - ${i + 1}`}
                    className="h-52 w-full rounded-2xl object-cover ring-1 ring-gray-100"
                  />
                </a>
              ))}
            </div>
          </Fancybox>

          {/* Title row */}
          <div className="flex flex-col items-start justify-between gap-3 px-6 pb-6 pt-4 sm:flex-row sm:items-end sm:px-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {room.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                {chips.map(({ icon: Icon, label }, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-200"
                  >
                    <Icon size={14} className="mr-1" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                title="Share"
              >
                <Share2 size={16} />
                Share
              </button>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ ["--accent"]: ACCENT }}
              >
                Apply <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT: description & facts */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Description
            </h3>
            <p className="text-[15px] leading-7 text-gray-700">
              {room.description || "No description provided."}
            </p>
          </div>

          {/* Facts grid (replaces the table) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Room Details
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon size={18} className="text-gray-500" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: sticky card */}
        <aside
          className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          {/* Price */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Monthly Rent</h3>
            <p
              className={`mt-1 text-2xl font-bold ${
                priceLabel === "Not specified"
                  ? "text-gray-600"
                  : "text-green-600"
              }`}
            >
              {priceLabel}
            </p>
          </div>

          {/* Contact */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            {room.contact ? (
              <p className="mt-1 flex items-center text-sm text-gray-800">
                <Phone size={16} className="mr-2 text-gray-600" />
                {room.contact}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                No contact info provided.
              </p>
            )}
          </div>

          {/* Posted by */}
          {
            <p className="mt-4 text-xs text-gray-500">
              Posted by{" "}
              <span className="font-medium text-gray-800">
                {formatName(room.postedByName)}
              </span>
            </p>
          }

          {/* CTA */}
          <div className="mt-6">
            <Link
              to="/apply"
              className="block w-full rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              style={{ ["--accent"]: ACCENT }}
            >
              Apply Now
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default RoomDetailContent;
