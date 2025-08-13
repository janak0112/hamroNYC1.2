// src/components/admin/PreviewModal.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Ban,
  Trash2,
  Info,
} from "lucide-react";

// If you already have tokens, import them. Otherwise this works standalone.
const BRAND = "#CD4A3D";

export default function PreviewModal({
  item,
  index = 0,
  total = 1,
  onClose,
  onPrev,
  onNext,
  onApprove,
  onDecline,
  onDelete, // optional
}) {
  // ---- Derive fields ----
  const created = useMemo(
    () => new Date(item?.$createdAt).toLocaleString(),
    [item]
  );
  const updated = useMemo(
    () =>
      item?.$updatedAt ? new Date(item.$updatedAt).toLocaleString() : null,
    [item]
  );

  const images = useMemo(() => extractImages(item), [item]);
  const [active, setActive] = useState(0);

  // Keep active index in range if images change
  useEffect(() => {
    if (active >= images.length) setActive(0);
  }, [images, active]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key.toLowerCase() === "a") onApprove?.();
      if (e.key.toLowerCase() === "d") onDecline?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, onApprove, onDecline]);

  // prevent backdrop click from bubbling inside panel
  const stop = useCallback((e) => e.stopPropagation(), []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-[min(1100px,95vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={stop}
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-5">
          <div className="min-w-0 flex-1">
            {/* Shortcuts strip */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
              <kbd className="rounded-md bg-gray-50 px-1.5 py-0.5">←</kbd>/
              <kbd className="rounded-md bg-gray-50 px-1.5 py-0.5">→</kbd>
              <span>navigate</span>
              <span className="mx-1 text-gray-300">•</span>
              <kbd className="rounded-md bg-gray-50 px-1.5 py-0.5">A</kbd>
              <span>approve</span>
              <span className="mx-1 text-gray-300">•</span>
              <kbd className="rounded-md bg-gray-50 px-1.5 py-0.5">D</kbd>
              <span>decline</span>
              <span className="mx-1 text-gray-300">•</span>
              <kbd className="rounded-md bg-gray-50 px-1.5 py-0.5">Esc</kbd>
              <span>close</span>
            </div>

            <h3 className="mt-2 truncate text-lg font-bold leading-6 text-gray-800">
              {item?.title || "Untitled"}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium capitalize text-gray-700">
                {item?.type || "—"}
              </span>
              <span className="text-[11px] text-gray-500">
                {index + 1} / {total}
              </span>

              {item?.approvedByAdmin === true && (
                <Chip tone="emerald">
                  <Check className="h-3.5 w-3.5" />
                  Approved
                </Chip>
              )}
              {item?.approvedByAdmin === false && (
                <Chip tone="rose">
                  <Ban className="h-3.5 w-3.5" />
                  Unapproved
                </Chip>
              )}
              {item?.approvedByAdmin == null && (
                <Chip tone="amber">
                  <Info className="h-3.5 w-3.5" />
                  Pending
                </Chip>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CD4A3D]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid max-h-[75vh] grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-5">
          {/* Main */}
          <div className="space-y-4 md:col-span-3">
            {/* Image viewer */}
            {images.length > 0 && (
              <div className="rounded-2xl bg-white p-0 shadow-sm">
                {/* Main image area */}
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={images[active]}
                    alt={`image-${active}`}
                    className="aspect-[16/10] w-full object-cover"
                  />

                  {/* Image nav */}
                  {images.length > 1 && (
                    <>
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <button
                          onClick={() =>
                            setActive(
                              (i) => (i - 1 + images.length) % images.length
                            )
                          }
                          className="pointer-events-auto rounded-full bg-white p-2 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CD4A3D]"
                          title="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          onClick={() =>
                            setActive((i) => (i + 1) % images.length)
                          }
                          className="pointer-events-auto rounded-full bg-white p-2 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CD4A3D]"
                          title="Next image"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbs */}
                {images.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#CD4A3D] ${
                          i === active ? "ring-2 ring-[#CD4A3D]" : ""
                        }`}
                        title={`Open image ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt={`thumb-${i}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {item?.description && (
              <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h4 className="mb-2 text-sm font-semibold text-gray-800">
                  Description
                </h4>
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {item.description}
                </p>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:col-span-2">
            <aside className="rounded-2xl bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                Details
              </h4>
              <dl className="text-sm text-gray-700">
                <KV label="Type" value={item?.type} />
                <KV label="Created" value={created} />
                {updated && <KV label="Updated" value={updated} />}
                {/* Add any other known fields you want to highlight */}
                <KV label="Location" value={item?.location} />
                <KV label="Price" value={item?.price} />
                <KV label="Contact" value={item?.contact} />
              </dl>
            </aside>

            {/* Actions */}
            <div className="sticky bottom-0 rounded-2xl bg-white/90 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
              <div className="flex flex-wrap items-center gap-2">
                {item?.approvedByAdmin !== true && (
                  <button
                    type="button"
                    onClick={onApprove}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#CD4A3D] transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#CD4A3D] focus:ring-offset-2"
                    title="A"
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </button>
                )}

                {item?.approvedByAdmin !== false && (
                  <button
                    type="button"
                    onClick={onDecline}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-gray-600 transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#CD4A3D] focus:ring-offset-2"
                    title="D"
                  >
                    <Ban className="mr-1 h-4 w-4" />
                    Decline
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#CD4A3D] focus:ring-offset-2"
                    title="Delete"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#CD4A3D] focus:ring-offset-2"
                >
                  Close
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Tip: <kbd className="rounded bg-gray-50 px-1">←</kbd>/
                <kbd className="rounded bg-gray-50 px-1">→</kbd> navigate ·{" "}
                <kbd className="rounded bg-gray-50 px-1">A</kbd> approve ·{" "}
                <kbd className="rounded bg-gray-50 px-1">D</kbd> decline.
              </p>
            </div>
          </div>
        </div>

        {/* Post-to-post nav */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onPrev}
            className="pointer-events-auto rounded-full bg-white p-2 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CD4A3D]"
            title="Previous (←)"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onNext}
            className="pointer-events-auto rounded-full bg-white p-2 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CD4A3D]"
            title="Next (→)"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------- Tiny subcomponents ------- */

function KV({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  const v =
    typeof value === "string"
      ? value
      : typeof value === "number"
      ? String(value)
      : Array.isArray(value)
      ? value.join(", ")
      : JSON.stringify(value);
  return (
    <div className="py-1.5">
      <dt className="text-[12px] text-gray-500">{label}</dt>
      <dd className="break-words text-sm text-gray-800">{v}</dd>
    </div>
  );
}

function Chip({ tone = "gray", children }) {
  const tones = {
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    emerald: "bg-emerald-50 text-emerald-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ------- Local util ------- */
function extractImages(item) {
  if (!item) return [];
  // common shapes: item.images (array or CSV), or item.photos, or first image-like keys
  const tryKeys = ["images", "photos", "imageUrls", "gallery"];
  for (const k of tryKeys) {
    const v = item[k];
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === "string") {
      const arr = v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length) return arr;
    }
  }
  // Fallback: scan object for url-looking strings
  const urls = [];
  for (const [k, v] of Object.entries(item)) {
    if (
      typeof v === "string" &&
      /(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(v)
    ) {
      urls.push(v);
    }
  }
  return urls;
}
