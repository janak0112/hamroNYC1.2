import React, { useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  CalendarClock,
  CheckCircle2,
  User2,
  Tag,
  Share2,
  Shield,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import MarketImg from "../../../assets/img/no-image.png";

const ACCENT = "#CD4A3D";

const MarketDetailContent = ({ item, imageUrl }) => {
  // Normalize images: accept string or string[]
  const images = useMemo(() => {
    const arr = Array.isArray(imageUrl) ? imageUrl : [imageUrl].filter(Boolean);
    const cleaned = (arr.length ? arr : [MarketImg]).map((u) => u || MarketImg);
    return cleaned;
  }, [imageUrl]);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeSrc = images[activeIdx] || MarketImg;

  const formatName = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "";

  const postedBy =
    (item.postedBy && formatName(JSON.parse(item.postedBy)?.name)) ||
    item.postedByName ||
    item.email ||
    "Anonymous User";

  const priceText = item.price
    ? `$${Number(item.price).toLocaleString()}`
    : "Not specified";

  const postedDate = item.$createdAt
    ? new Date(item.$createdAt).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Title + quick meta */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {item.title || "Untitled listing"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} />
              {item.location || "Unknown location"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={16} />
              Posted {postedDate}
            </span>
            {item.condition && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                <CheckCircle2 size={14} />
                {item.condition}
              </span>
            )}
            {item.type && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                <Tag size={14} />
                {item.type}
              </span>
            )}
          </div>
        </div>

        {/* Light actions */}
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            onClick={() => {
              try {
                navigator.share?.({
                  title: item.title,
                  text: item.description?.slice(0, 120),
                  url: window.location.href,
                });
              } catch {}
            }}
            title="Share"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            title="Save"
            onClick={() => {}}
          >
            <Heart size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT: Gallery + description */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
            style={{
              boxShadow:
                "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
            }}
          >
            <div className="relative aspect-[16/9] w-full bg-gray-50">
              <img
                src={activeSrc || MarketImg}
                alt={item.title || "Listing image"}
                onError={(e) => (e.currentTarget.src = MarketImg)}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    onClick={() => setActiveIdx(i)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${
                      i === activeIdx ? "border-gray-900" : "border-gray-200"
                    } bg-white transition`}
                    title={`Image ${i + 1}`}
                  >
                    <img
                      src={src || MarketImg}
                      alt={`Thumb ${i + 1}`}
                      onError={(e) => (e.currentTarget.src = MarketImg)}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Description
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  item.description?.replace(/\n/g, "<br />") ||
                  "No description provided.",
              }}
            />
          </div>
        </div>

        {/* RIGHT: Sticky info card */}
        <aside
          className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          {/* Price */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p className="mt-1 text-3xl font-bold text-gray-900">{priceText}</p>
          </div>

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

          {/* Posted by */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Seller</h3>
            <p className="mt-1 flex items-center gap-2 text-gray-800">
              <User2 size={16} className="text-blue-500" />
              <span className="font-medium">{postedBy}</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Link
              to="/message"
              className="block w-full rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              style={{ ["--accent"]: ACCENT }}
            >
              Message Seller
            </Link>
            {item.contact && (
              <a
                href={`tel:${String(item.contact).replace(/\D+/g, "")}`}
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Call Seller
              </a>
            )}
          </div>

          {/* Safety note */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <div className="mb-1 flex items-center gap-1.5 font-semibold">
              <Shield size={14} />
              Safety tip
            </div>
            Meet in public places and inspect items before paying.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MarketDetailContent;
