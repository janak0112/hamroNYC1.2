// src/components/admin/ModerationQueue.jsx
import React, { useMemo, useState, useCallback } from "react";
import { Info, XCircle, CheckCircle2, Eye, Check, Ban } from "lucide-react";
import { BRAND, btnBase, btnBrandSolid } from "./ui"; // adjust path
import PreviewModal from "./PreviewModal"; // <-- reuse your existing modal

export default function ModerationQueue({
  queue = [],
  rangeLabelText = "",
  onApprove,
  onDecline,
  onDelete, // optional: if you want Delete in the modal
}) {
  const [statusFilter, setStatusFilter] = useState("pending"); // 'pending' | 'unapproved' | 'approved'
  const [previewIndex, setPreviewIndex] = useState(null); // index into filtered list

  // Filter by tab
  const filteredQueue = useMemo(() => {
    return queue.filter((p) => {
      if (statusFilter === "pending")
        return p.approvedByAdmin === undefined || p.approvedByAdmin === null;
      if (statusFilter === "unapproved") return p.approvedByAdmin === false;
      if (statusFilter === "approved") return p.approvedByAdmin === true;
      return true;
    });
  }, [queue, statusFilter]);

  const openPreview = useCallback(
    (id) => {
      const idx = filteredQueue.findIndex((p) => p.$id === id);
      if (idx >= 0) setPreviewIndex(idx);
    },
    [filteredQueue]
  );

  const closePreview = useCallback(() => setPreviewIndex(null), []);

  const goPrev = useCallback(() => {
    setPreviewIndex((i) =>
      i === null ? null : (i - 1 + filteredQueue.length) % filteredQueue.length
    );
  }, [filteredQueue.length]);

  const goNext = useCallback(() => {
    setPreviewIndex((i) =>
      i === null ? null : (i + 1) % filteredQueue.length
    );
  }, [filteredQueue.length]);

  // Handlers passed into modal so it can approve/decline and then optionally step or close
  const handleApprove = useCallback(
    async (item) => {
      await onApprove?.(item);
      // stay in modal; you can also auto-advance:
      // goNext();
    },
    [onApprove]
  );

  const handleDecline = useCallback(
    async (item) => {
      await onDecline?.(item);
      // goNext();
    },
    [onDecline]
  );

  const handleDelete = useCallback(
    async (item) => {
      await onDelete?.(item);
      // After delete, close or advance:
      // closePreview();
    },
    [onDelete]
  );

  return (
    <section className="bg-white rounded-2xl shadow-lg p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Moderation Queue
          </h3>
          <p className="text-xs text-gray-500">
            {filteredQueue.length} {statusFilter} posts (
            {rangeLabelText.toLowerCase()}).
          </p>
        </div>

        {/* Status tabs (borderless, pill group) */}
        <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 p-1">
          {[
            { key: "pending", label: "Pending" },
            { key: "unapproved", label: "Unapproved" },
            { key: "approved", label: "Approved" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setStatusFilter(opt.key);
                setPreviewIndex(null);
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                statusFilter === opt.key
                  ? `bg-[${BRAND}] text-white shadow-sm hover:opacity-95 focus:ring-[${BRAND}]`
                  : `text-gray-700 hover:bg-white focus:ring-[${BRAND}]`
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filteredQueue.length === 0 && (
        <div className="py-10 text-center text-sm text-gray-600">
          No {statusFilter} posts. 🎉
        </div>
      )}

      {/* Card list (borderless vibe) */}
      <ul className="space-y-3">
        {filteredQueue.map((p, i) => {
          const postedBy =
            typeof p.postedBy === "string" ? safeParse(p.postedBy) : p.postedBy;
          const name = postedBy?.name || "—";
          const status =
            p.approvedByAdmin === false
              ? "Unapproved"
              : p.approvedByAdmin === true
              ? "Approved"
              : "Pending";

          return (
            <li key={p.$id}>
              <article className="rounded-xl bg-white shadow-sm transition hover:shadow-md">
                <div className="p-4 sm:p-5">
                  {/* Top row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div
                        className="truncate text-sm font-semibold text-gray-800"
                        title={p.title || "Untitled"}
                      >
                        {p.title || "Untitled"}
                      </div>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openPreview(p.$id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        title="Quick view"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>

                      {status !== "Approved" && (
                        <button
                          onClick={() => handleApprove(p)}
                          className={`${btnBase} ${btnBrandSolid} text-xs px-2.5 py-1.5 transition hover:shadow-sm focus:ring-2 focus:ring-offset-2`}
                          style={{ backgroundColor: BRAND }}
                          title="Approve"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </button>
                      )}

                      {status !== "Unapproved" && (
                        <button
                          onClick={() => handleDecline(p)}
                          className={`${btnBase} text-white text-xs px-2.5 py-1.5 transition hover:opacity-95 focus:ring-2 focus:ring-offset-2`}
                          style={{ backgroundColor: "#6B7280" }}
                          title="Decline"
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700">
                      {humanizeType(p.type)}
                    </span>

                    {status === "Pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-medium text-amber-700">
                        <Info className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    )}
                    {status === "Unapproved" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 font-medium text-rose-700">
                        <XCircle className="h-3.5 w-3.5" />
                        Unapproved
                      </span>
                    )}
                    {status === "Approved" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approved
                      </span>
                    )}

                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 font-medium text-gray-600">
                      {name}
                    </span>

                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 font-medium text-gray-600">
                      {new Date(p.$createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      {previewIndex !== null && filteredQueue[previewIndex] && (
        <PreviewModal
          item={filteredQueue[previewIndex]}
          index={previewIndex}
          total={filteredQueue.length}
          onClose={closePreview}
          onPrev={goPrev}
          onNext={goNext}
          onApprove={() => handleApprove(filteredQueue[previewIndex])}
          onDecline={() => handleDecline(filteredQueue[previewIndex])}
          onDelete={
            onDelete
              ? () => handleDelete(filteredQueue[previewIndex])
              : undefined
          }
        />
      )}
    </section>
  );
}

function humanizeType(t) {
  if (t === "travelCompanion") return "Travel";
  return t?.charAt(0).toUpperCase() + t?.slice(1);
}
function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
