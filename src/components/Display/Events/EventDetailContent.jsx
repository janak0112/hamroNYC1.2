import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Ticket,
  Share2,
  ArrowUpRight,
} from "lucide-react";

const ACCENT = "#CD4A3D";

function EventDetailContent({ event, imageUrl }) {
  const imageUrls = Array.isArray(imageUrl) ? imageUrl.filter(Boolean) : [];

  const formatName = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "";

  const dateLabel = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not provided";

  const timeLabel = event.eventTime
    ? new Date(`1970-01-01T${event.eventTime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time not provided";

  const isOnline = event.eventMode === "online";
  const isPaid = event.ticketOption === "paid";
  const hasTicketLink = !!event.ticketLink;

  const share = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: "Check out this event on HamroNYC",
          url: typeof window !== "undefined" ? window.location.href : undefined,
        });
      }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      {imageUrls.length > 0 && (
        <div
          className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          <div className="aspect-[16/7] w-full overflow-hidden bg-gray-50">
            <img
              src={imageUrls[0].trim()}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title & badges */}
          <div className="flex flex-col items-start justify-between gap-4 px-6 pb-6 pt-5 sm:flex-row sm:items-end sm:px-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {event.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ring-1 ${
                    isOnline
                      ? "bg-blue-50 text-blue-700 ring-blue-200"
                      : "bg-green-50 text-green-700 ring-green-200"
                  }`}
                >
                  {isOnline ? "Online" : "In-Person"}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
                  <Calendar size={14} className="mr-1" />
                  {dateLabel}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
                  <Clock size={14} className="mr-1" />
                  {timeLabel}
                </span>
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
              {hasTicketLink && (
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ ["--accent"]: ACCENT }}
                >
                  Get Tickets <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: details */}
        <div className="lg:col-span-2">
          {/* Info blocks */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Location / Link */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Where
              </h3>
              {isOnline ? (
                event.onlineLink ? (
                  <a
                    href={event.onlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 underline-offset-2 hover:underline"
                  >
                    <Globe size={18} className="mr-2" />
                    Join online event
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">
                    Online link not provided.
                  </p>
                )
              ) : event.location ? (
                <p className="inline-flex items-center text-gray-800">
                  <MapPin size={18} className="mr-2 text-gray-600" />
                  <span className="font-medium">{event.location}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">Location not provided.</p>
              )}
            </div>

            {/* Tickets */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Tickets
              </h3>
              <div className="flex items-center gap-2 text-gray-800">
                <Ticket size={18} className="text-gray-600" />
                <span className="font-medium">
                  {event.ticketOption === "free"
                    ? "Free entry"
                    : isPaid
                    ? `Paid — $${Number(
                        event.ticketCost || 0
                      ).toLocaleString()}`
                    : "Not specified"}
                </span>
              </div>
              {hasTicketLink && (
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  Register / Get Ticket
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              About this event
            </h3>
            <p className="text-[15px] leading-7 text-gray-700">
              {event.description || "No description provided."}
            </p>
          </div>

          {/* Extra images */}
          {imageUrls.length > 1 && (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-gray-800">
                Gallery
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imageUrls.slice(1, 7).map((src, i) => (
                  <img
                    key={i}
                    src={src.trim()}
                    alt={`${event.title} ${i + 2}`}
                    className="h-32 w-full rounded-xl object-cover ring-1 ring-gray-100"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: sticky card */}
        <aside
          className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          <h3 className="text-base font-bold text-gray-900">Contact</h3>

          <div className="mt-3 space-y-3 text-sm">
            {event.contact ? (
              <p className="flex items-center text-gray-800">
                <Phone size={18} className="mr-2 text-gray-600" />
                {event.contact}
              </p>
            ) : (
              <p className="text-gray-500">No contact info provided.</p>
            )}

            {event.email && (
              <a
                href={`mailto:${event.email}`}
                className="inline-flex items-center text-blue-600 underline-offset-2 hover:underline"
              >
                Email organizer
              </a>
            )}

            {event.postedByName && (
              <p className="text-gray-500">
                Posted by{" "}
                <span className="font-medium text-gray-800">
                  {event.postedByName}
                </span>
              </p>
            )}
          </div>

          <div className="mt-5">
            <a
              href={hasTicketLink ? event.ticketLink : "#"}
              target={hasTicketLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition ${
                hasTicketLink
                  ? "bg-[var(--accent,#CD4A3D)] hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              style={{ ["--accent"]: ACCENT }}
            >
              {hasTicketLink ? "Register Now" : "No Ticket Link"}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EventDetailContent;
