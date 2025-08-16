import React, { useState, useCallback, useContext, useMemo } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  ImageOff,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ImgApt from "../../../assets/img/noimage.png";
import { getImageUrls } from "../../../utils/uploadFile";
import { DataContext } from "../../../context/DataContext";

const ACCENT = "#eb3822";

export default function ListingList() {
  const { type } = useParams();
  const { jobs, market, events, rooms, loading, error } =
    useContext(DataContext);

  const dataMap = { jobs, market, events, rooms };
  const listings = dataMap[type] || [];

  const [activeImages, setActiveImages] = useState({});
  const changeSlide = useCallback((itemId, index) => {
    setActiveImages((prev) => ({ ...prev, [itemId]: index }));
  }, []);

  const title = useMemo(
    () => `Discover All ${type?.charAt(0).toUpperCase() + type?.slice(1)}`,
    [type]
  );

  if (loading) {
    // simple shimmer grid
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <HeaderBlock title={title} type={type} />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-9 w-28 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error)
    return <p className="p-8 text-center text-red-500">Error: {error}</p>;
  if (!listings || listings.length === 0)
    return <p className="p-8 text-center">No {type} available.</p>;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <HeaderBlock title={title} type={type} />

      <div className="grid items-stretch grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {listings.map((item) => {
          const active = activeImages[item.$id] || 0;
          const images = item.imageIds?.length
            ? getImageUrls(item.imageIds)
            : [ImgApt];
          const cover = images[active] || ImgApt;

          return (
            <article
              key={item.$id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition shadow-sm hover:shadow-lg"
              style={{
                boxShadow:
                  "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
              }}
            >
              {/* Media */}
              <div className="relative">
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {cover ? (
                    <img
                      src={cover}
                      alt={item.title}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                      onError={(e) => (e.currentTarget.src = ImgApt)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <ImageOff className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Price / type badge */}
                <TopRightBadge type={type} item={item} />
              </div>

              {/* Thumbs */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => changeSlide(item.$id, i)}
                      className={`aspect-video h-10 overflow-hidden rounded-lg ring-offset-2 transition ${
                        i === active
                          ? "ring-2 ring-[var(--accent,#CD4A3D)]"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ ["--accent"]: ACCENT }}
                      aria-label={`Preview image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt="thumbnail"
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.src = ImgApt)}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Body */}
              <div className="px-4 pt-3">
                <h2 className="line-clamp-1 text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>
                {item.location && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} /> {item.location}
                  </p>
                )}
              </div>

              {/* Meta list */}
              <div className="px-4 mt-3 text-sm text-gray-700">
                <ul className="divide-y divide-gray-100">
                  {type === "events" && (
                    <>
                      <MetaRow
                        label={
                          <>
                            <Calendar size={14} /> Date
                          </>
                        }
                      >
                        {safeDate(item.eventDate)}
                      </MetaRow>
                      <MetaRow
                        label={
                          <>
                            <Clock size={14} /> Time
                          </>
                        }
                      >
                        {safeTime(item.eventTime)}
                      </MetaRow>
                    </>
                  )}

                  {type === "jobs" && (
                    <>
                      <MetaRow
                        label={
                          <>
                            <DollarSign size={14} /> Salary
                          </>
                        }
                      >
                        {item.salary
                          ? `$${formatMoney(item.salary)} / ${
                              item.salaryType || "hourly"
                            }`
                          : "Not specified"}
                      </MetaRow>
                      <MetaRow
                        label={
                          <>
                            <Briefcase size={14} /> Type
                          </>
                        }
                      >
                        <span className="capitalize">
                          {item.jobType || "—"}
                        </span>
                      </MetaRow>
                    </>
                  )}

                  {type === "rooms" && (
                    <MetaRow label="Available From">
                      {safeDate(item.availableFrom)}
                    </MetaRow>
                  )}

                  {type === "market" && (
                    <MetaRow label="Price">
                      {item.price
                        ? `$${formatMoney(item.price)}`
                        : "Not specified"}
                    </MetaRow>
                  )}

                  {item.contact && (
                    <MetaRow label="Contact">{item.contact}</MetaRow>
                  )}
                </ul>
              </div>

              {/* Description */}
              <div className="px-4 py-3">
                <p className="line-clamp-2 text-sm text-gray-600">
                  {item.description || "No description available."}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="mt-auto px-4 pb-4">
                <Link
                  to={`/${type}/${item.$id}`}
                  className="inline-block rounded-full border border-[var(--accent,#CD4A3D)] px-4 py-2 text-sm font-semibold text-[var(--accent,#CD4A3D)] transition hover:bg-[var(--accent,#CD4A3D)] hover:text-white"
                  style={{ ["--accent"]: ACCENT }}
                >
                  View details
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- helpers / tiny components ---------- */

const HeaderBlock = ({ title, type }) => (
  <div className="mb-8 text-center">
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      {title}{" "}
      <span
        className="capitalize text-[var(--accent,#CD4A3D)]"
        style={{ ["--accent"]: ACCENT }}
      >
        {type}
      </span>
    </h1>
    <p className="mt-1 text-sm text-gray-500">
      Find the best {type} listings updated daily
    </p>
  </div>
);

const MetaRow = ({ label, children }) => (
  <li className="flex items-center justify-between gap-2 py-2">
    <span className="flex items-center gap-1.5 text-gray-500">{label}</span>
    <span className="text-gray-800">{children}</span>
  </li>
);

const TopRightBadge = ({ type, item }) => {
  const base =
    "absolute right-3 top-3 hidden rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-black/5 sm:block";

  if (type === "market") {
    return (
      <span className={`${base}`} style={{ background: "rgba(16,185,129,1)" }}>
        {item.price ? `$${formatMoney(item.price)}` : "—"}
      </span>
    );
  }
  if (type === "rooms") {
    return (
      <span className={`${base}`} style={{ background: ACCENT }}>
        {item.price ? `$${formatMoney(item.price)}/mo` : "—"}
      </span>
    );
  }
  if (type === "jobs") {
    const s = item.salary ? `$${formatMoney(item.salary)}` : "—";
    return (
      <span className={`${base}`} style={{ background: ACCENT }}>
        {s} {item.salaryType ? `/${item.salaryType}` : ""}
      </span>
    );
  }
  if (type === "events") {
    const isFree = item.ticketOption === "free";
    return (
      <span
        className={`${base}`}
        style={{
          background: isFree ? "rgba(59,130,246,1)" : "rgba(16,185,129,1)",
        }}
      >
        {isFree
          ? "Free"
          : item.ticketCost
          ? `$${formatMoney(item.ticketCost)}`
          : "Ticketed"}
      </span>
    );
  }
  return null;
};

function safeDate(d) {
  try {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(+dt) ? "—" : dt.toLocaleDateString();
  } catch {
    return "—";
  }
}

function safeTime(t) {
  try {
    if (!t) return "—";
    const dt = new Date(`1970-01-01T${t}`);
    return isNaN(+dt)
      ? "—"
      : dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

function formatMoney(val) {
  const n = typeof val === "number" ? val : Number(val);
  if (!Number.isFinite(n)) return val;
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    n
  );
}
