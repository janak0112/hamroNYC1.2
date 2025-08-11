// pages/AdminPosts.jsx
import React, { useContext, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { Search, CheckCircle2, XCircle, Filter, Shield } from "lucide-react";

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
    // use either one depending on your DataContext
    isAdmin,
    adminMode,
  } = useContext(DataContext);

  const canModerate = (typeof isAdmin === "boolean" ? isAdmin : undefined) ?? !!adminMode;

  const [activeTab, setActiveTab] = useState("all");
  const [status, setStatus] = useState("pending"); // 'pending' | 'approved' | 'all'
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = posts || [];

    if (activeTab !== "all") {
      list = list.filter((p) => p.type === activeTab);
    }

    if (status === "pending") {
      list = list.filter((p) => !p.approvedByAdmin);
    } else if (status === "approved") {
      list = list.filter((p) => !!p.approvedByAdmin);
    }

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) =>
        (p.title || "").toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s)
      );
    }

    // newest first
    return list.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  }, [posts, activeTab, status, q]);

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
            onApprove={() => approveDocument(item.$collectionId, item.$id)}
            onDecline={() => declineDocument(item.$collectionId, item.$id)}
            onDelete={() => handleDeleteDocument(item.$collectionId, item.$id)}
          />
        ))}
      </section>

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-600">No posts match your filters.</p>
        </div>
      )}
    </div>
  );
}

export default AdminPosts;

function AdminPostCard({ item, onApprove, onDecline, onDelete }) {
  const postedBy =
    typeof item.postedBy === "string"
      ? safeParse(item.postedBy)
      : item.postedBy ?? null;

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
        {item.type === "events" && (item.eventDate || item.eventTime) && (
          <div className="col-span-2">
            <dt className="text-gray-500">Event</dt>
            <dd>
              {item.eventDate
                ? new Date(item.eventDate).toLocaleDateString()
                : ""}
              {item.eventTime
                ? " · " + new Date(item.eventTime).toLocaleTimeString()
                : ""}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-auto flex items-center justify-between">
        {item.approvedByAdmin ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
            <CheckCircle2 className="h-4 w-4" />
            Approved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            <XCircle className="h-4 w-4" />
            Pending
          </span>
        )}

        <div className="flex items-center gap-2">
          {!item.approvedByAdmin ? (
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
          ) : (
            <button
              onClick={onDecline}
              className="rounded-xl bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
              title="Mark as pending again"
            >
              Unapprove
            </button>
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

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
