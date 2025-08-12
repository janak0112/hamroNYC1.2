// pages/AdminPosts.jsx
import React, { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { DataContext } from "../../context/DataContext";
import { Search, CheckCircle2, XCircle, Filter, Shield, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const TABS = [
  { key: "all", label: "All" },
  { key: "rooms", label: "Rooms" },
  { key: "jobs", label: "Jobs" },
  { key: "market", label: "Market" },
  { key: "events", label: "Events" },
  { key: "travelCompanion", label: "Travel" },
];

function AdminPosts() {
  const {
    posts,
    loading,
    error,
    approveDocument,
    declineDocument,
    handleDeleteDocument,
    isAdmin,
    adminMode,
    setAdminMode, // ⬅️ ensure DataContext exposes this (your code does)
  } = useContext(DataContext);

  // Make sure we’re in admin mode here so unapproved/pending are fetched
  useEffect(() => { setAdminMode(true); }, [setAdminMode]);

  const canModerate = (typeof isAdmin === "boolean" ? isAdmin : undefined) ?? !!adminMode;

  const [activeTab, setActiveTab] = useState("all");
  const [status, setStatus] = useState("unapproved"); // 'pending' | 'approved' | 'unapproved' | 'all'
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = posts || [];

    if (activeTab !== "all") {
      list = list.filter((p) => p.type === activeTab);
    }

    if (status === "approved") {
      list = list.filter((p) => p.approvedByAdmin === true);
    } else if (status === "unapproved") {
      list = list.filter((p) => p.approvedByAdmin === false);
    } else if (status === "pending") {
      list = list.filter((p) => p.approvedByAdmin === null || p.approvedByAdmin === undefined);
    }

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(s) ||
          (p.description || "").toLowerCase().includes(s)
      );
    }

    return list.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  }, [posts, activeTab, status, q]);

  // ----- Preview modal state -----
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // compute current index in filtered list
  const index = useMemo(
    () => filtered.findIndex((d) => d.$id === selectedId),
    [filtered, selectedId]
  );
  const selected = index >= 0 ? filtered[index] : null;

  // auto-close if filter changes and selected item disappears
  useEffect(() => {
    if (open && index === -1) setOpen(false);
  }, [open, index]);

  const openPreview = useCallback((id) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  const closePreview = useCallback(() => setOpen(false), []);

  const goPrev = useCallback(() => {
    if (!filtered.length) return;
    const i = index <= 0 ? filtered.length - 1 : index - 1;
    setSelectedId(filtered[i].$id);
  }, [filtered, index]);

  const goNext = useCallback(() => {
    if (!filtered.length) return;
    const i = index >= filtered.length - 1 ? 0 : index + 1;
    setSelectedId(filtered[i].$id);
  }, [filtered, index]);

  // Keyboard shortcuts inside modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closePreview();
      if (e.key.toLowerCase() === "a" && selected) {
        e.preventDefault();
        handleApprove(selected);
      }
      if (e.key.toLowerCase() === "d" && selected) {
        e.preventDefault();
        handleDecline(selected);
      }
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, selected, goPrev, goNext]);

  // Action handlers that keep you in the modal and auto-advance
  const handleApprove = async (item) => {
    await approveDocument(item.$collectionId, item.$id);
    // try to advance to next unmoderated item if it still exists
    goNext();
  };
  const handleDecline = async (item) => {
    await declineDocument(item.$collectionId, item.$id);
    goNext();
  };
  const handleDelete = async (item) => {
    await handleDeleteDocument(item.$collectionId, item.$id);
    // after delete, the filtered list shrinks; if no items left, close
    if (filtered.length <= 1) closePreview();
    else goNext();
  };

  if (!canModerate) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <Shield className="mx-auto mb-3 h-8 w-8 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Admins only</h2>
          <p className="mt-1 text-sm text-gray-600">
            You don’t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin · Posts</h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <nav className="flex rounded-xl border bg-white p-1 shadow-sm">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  activeTab === t.key
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Status filter */}
          <label className="relative">
            <select
              className="h-10 rounded-xl border bg-white pr-8 pl-10 text-sm shadow-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="unapproved">Unapproved</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="all">All</option>
            </select>
            <Filter className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </label>

          {/* Search */}
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title/description…"
              className="h-10 w-64 rounded-xl border bg-white pl-9 pr-3 text-sm shadow-sm focus:outline-none"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Loading…</p>
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm text-rose-700">Error: {error}</p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <AdminPostCard
            key={item.$id}
            item={item}
            onPreview={() => openPreview(item.$id)}
            onApprove={() => handleApprove(item)}
            onDecline={() => handleDecline(item)}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </section>

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-600">No posts match your filters.</p>
        </div>
      )}

      {/* Preview Modal */}
      {open && selected && (
        <PreviewModal
          item={selected}
          index={index}
          total={filtered.length}
          onClose={closePreview}
          onPrev={goPrev}
          onNext={goNext}
          onApprove={() => handleApprove(selected)}
          onDecline={() => handleDecline(selected)}
          onDelete={() => handleDelete(selected)}
        />
      )}
    </div>
  );
}

export default AdminPosts;

function AdminPostCard({ item, onPreview, onApprove, onDecline, onDelete }) {
  const postedBy =
    typeof item.postedBy === "string" ? safeParse(item.postedBy) : item.postedBy ?? null;
  const created = new Date(item.$createdAt).toLocaleString();

  return (
    <div className="flex flex-col rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {item.title || "Untitled"}
        </h3>
        <span className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] capitalize text-gray-600">
          {item.type}
        </span>
      </div>

      <p className="mb-3 line-clamp-3 text-sm text-gray-600">
        {item.description || "—"}
      </p>

      <dl className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>
          <dt className="text-gray-500">Created</dt>
          <dd>{created}</dd>
        </div>
        {postedBy?.name && (
          <div>
            <dt className="text-gray-500">Posted by</dt>
            <dd>{postedBy.name}</dd>
          </div>
        )}
      </dl>

      <div className="mt-auto flex items-start justify-between flex-col gap-4">
        {item.approvedByAdmin === true ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
            <CheckCircle2 className="h-4 w-4" />
            Approved
          </span>
        ) : item.approvedByAdmin === false ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200">
            <XCircle className="h-4 w-4" />
            Unapproved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            <XCircle className="h-4 w-4" />
            Pending
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            title="Preview full post"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>

          {item.approvedByAdmin === true ? (
            <button
              onClick={onDecline}
              className="rounded-xl bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
              title="Mark as unapproved"
            >
              Unapprove
            </button>
          ) : (
            <>
              <button
                onClick={onApprove}
                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Approve
              </button>
              <button
                onClick={onDecline}
                className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                title="Keep hidden from public lists"
              >
                Decline
              </button>
            </>
          )}

          <button
            onClick={onDelete}
            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            title="Delete post"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onApprove,
  onDecline,
  onDelete,
}) {
  const created = new Date(item.$createdAt).toLocaleString();
  const updated = item.$updatedAt ? new Date(item.$updatedAt).toLocaleString() : null;

  const fields = buildFieldList(item);

  const maybeImages = extractImages(item);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-y-6 left-1/2 z-10 w-[min(960px,95vw)] -translate-x-1/2 rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              className="rounded-full border p-2 hover:bg-gray-50"
              title="Previous (←)"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onNext}
              className="rounded-full border p-2 hover:bg-gray-50"
              title="Next (→)"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="text-sm text-gray-500">{index + 1} / {total}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">{item.type}</div>
            <h3 className="max-w-[52ch] truncate text-lg font-semibold text-gray-900">
              {item.title || "Untitled"}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-5">
          {/* Main content */}
          <div className="md:col-span-3 space-y-4">
            {maybeImages?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {maybeImages.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border">
                    <img src={src} alt={`image-${i}`} className="h-48 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl border p-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-800">Description</h4>
              <p className="whitespace-pre-wrap text-sm text-gray-800">
                {item.description || "—"}
              </p>
            </div>

            {/* Raw JSON (collapsible) */}
            <details className="rounded-xl border p-4">
              <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                Raw data (JSON)
              </summary>
              <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-gray-800">
                {JSON.stringify(item, null, 2)}
              </pre>
            </details>
          </div>

          {/* Right rail */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border p-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-800">Details</h4>
              <dl className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <KV label="Created" value={created} />
                {updated && <KV label="Updated" value={updated} />}
                {fields.map(({ label, value }) => (
                  <KV key={label} label={label} value={value} />
                ))}
              </dl>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={onApprove}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                title="A"
              >
                Approve
              </button>
              <button
                onClick={onDecline}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                title="D"
              >
                Decline
              </button>
              <button
                onClick={onDelete}
                className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="ml-auto rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="grid grid-cols-3 gap-2">
      <dt className="col-span-1 text-gray-500">{label}</dt>
      <dd className="col-span-2 break-words">{v}</dd>
    </div>
  );
}

/** Build a readable field list by type + common keys */
function buildFieldList(item) {
  const omit = new Set([
    "$id", "$collectionId", "$databaseId", "$createdAt", "$updatedAt",
    "approvedByAdmin", "type", "description", "postedBy", "images", "photos", "imageUrls", "attachments"
  ]);

  const labelMapByType = {
    jobs: {
      company: "Company",
      salary: "Salary",
      location: "Location",
      email: "Email",
      contact: "Contact",
      experienceRequired: "Experience Required",
    },
    rooms: {
      price: "Price",
      location: "Location",
      contact: "Contact",
      roommates: "Roommates",
      furnished: "Furnished",
    },
    market: {
      price: "Price",
      condition: "Condition",
      location: "Location",
      contact: "Contact",
    },
    events: {
      eventDate: "Event Date",
      eventTime: "Event Time",
      location: "Location",
      contact: "Contact",
    },
    travelCompanion: {
      from: "From",
      to: "To",
      date: "Date",
      contact: "Contact",
    },
  };

  const specific = labelMapByType[item.type] || {};
  const out = [];

  // include typed labels first (if present)
  Object.entries(specific).forEach(([k, label]) => {
    if (item[k] !== undefined && item[k] !== null && item[k] !== "") {
      out.push({ label, value: k.toLowerCase().includes("date") ? toDate(item[k]) : item[k] });
      omit.add(k);
    }
  });

  // postedBy (object or stringified)
  const postedBy = typeof item.postedBy === "string" ? safeParse(item.postedBy) : item.postedBy;
  if (postedBy?.name) out.push({ label: "Posted by", value: postedBy.name });

  // add remaining custom keys
  Object.keys(item)
    .filter((k) => !omit.has(k) && !k.startsWith("$"))
    .forEach((k) => {
      out.push({ label: humanize(k), value: item[k] });
    });

  return out;
}

function extractImages(item) {
  // Try common image fields
  const candidates = [item.images, item.photos, item.imageUrls, item.attachments].filter(Boolean).flat();
  if (!candidates?.length) return [];
  // Only show string URLs
  return candidates
    .map((x) => (typeof x === "string" ? x : (x?.url || x?.href || x?.src)))
    .filter((s) => typeof s === "string" && s.length > 3);
}

function toDate(v) {
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    return d.toLocaleString();
  } catch {
    return v;
  }
}

function humanize(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}
