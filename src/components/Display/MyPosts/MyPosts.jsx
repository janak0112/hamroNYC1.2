import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import {
  Plus,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

const ACCENT = "#CD4A3D";

export default function MyPosts() {
  const {
    getMyPosts,
    loading,
    error,
    authUser,
    setPublish, // must exist in DataContext (see note below)
    handleDeleteDocument, // already exists in your DataContext
  } = useContext(DataContext);

  const navigate = useNavigate();
  const loggedInUserId = authUser;

  const [bucket, setBucket] = useState({
    jobs: [],
    rooms: [],
    market: [],
    events: [],
  });
  const [busyMap, setBusyMap] = useState({}); // { [docId]: boolean }

  // fetch all my posts
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!loading && loggedInUserId) {
        try {
          const mine = await getMyPosts(loggedInUserId);
          if (alive) setBucket(mine);
        } catch (e) {
          console.error("Error fetching my posts:", e);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [loading, loggedInUserId, getMyPosts]);

  // flatten for rendering
  const rows = useMemo(() => {
    const addType = (arr, type) => (arr || []).map((d) => ({ ...d, type }));
    return [
      ...addType(bucket.jobs, "jobs"),
      ...addType(bucket.rooms, "rooms"),
      ...addType(bucket.market, "market"),
      ...addType(bucket.events, "events"),
    ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  }, [bucket]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      jobs: bucket.jobs.length,
      rooms: bucket.rooms.length,
      market: bucket.market.length,
      events: bucket.events.length,
    }),
    [rows.length, bucket]
  );

  const setBusy = (id, v) =>
    setBusyMap((m) =>
      v ? { ...m, [id]: true } : (({ [id]: _, ...rest }) => rest)(m)
    );

  const onTogglePublish = async (row, to) => {
    const collId = row.collectionId || row.$collectionId;
    setBusy(row.$id, true);
    try {
      await setPublish(collId, row.$id, to);
      // optimistic local update
      setBucket((prev) => {
        const upd = (arr) =>
          arr.map((d) => (d.$id === row.$id ? { ...d, publish: to } : d));
        return {
          jobs: upd(prev.jobs),
          rooms: upd(prev.rooms),
          market: upd(prev.market),
          events: upd(prev.events),
        };
      });
    } catch (e) {
      console.error(e);
      alert("Could not change publish status.");
    } finally {
      setBusy(row.$id, false);
    }
  };

  const onDeletePost = async (row) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    const collId = row.collectionId || row.$collectionId;
    setBusy(row.$id, true);
    try {
      await handleDeleteDocument(collId, row.$id);
      // remove locally
      setBucket((prev) => {
        const rm = (arr) => arr.filter((d) => d.$id !== row.$id);
        return {
          jobs: rm(prev.jobs),
          rooms: rm(prev.rooms),
          market: rm(prev.market),
          events: rm(prev.events),
        };
      });
    } catch (e) {
      console.error(e);
      alert("Could not delete the post.");
    } finally {
      setBusy(row.$id, false);
    }
  };

  if (!loggedInUserId && !loading) {
    return (
      <EmptyState
        title="You're not signed in"
        subtitle="Please log in to view the posts you've created."
        ctaText="Log in"
        ctaTo="/login?redirect=/my-posts"
      />
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Header counts={counts} />
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 animate-pulse">
          <div className="h-5 w-1/3 rounded bg-gray-100" />
          <div className="mt-4 h-40 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="We hit a snag"
        subtitle={String(error)}
        ctaText="Try again"
        ctaTo="/my-posts"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Header counts={counts} />
      {rows.length === 0 ? (
        <EmptyState
          title="You haven't posted anything yet"
          subtitle="Create your first listing and it will show up here."
          ctaText="Post a listing"
          ctaTo="/post-listing"
        />
      ) : (
        <>
          {/* Mobile list */}
          <div className="md:hidden space-y-3 mt-8">
            {rows.map((d) => {
              const busy = !!busyMap[d.$id];
              return (
                <article
                  key={d.$id}
                  className="rounded-2xl border border-gray-100 bg-white p-4"
                  style={{
                    boxShadow:
                      "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500 capitalize">
                        {readableType(d.type)}
                      </div>
                      <Link
                        to={`/${d.type}/${d.$id}`}
                        className="mt-0.5 block text-base font-semibold text-gray-900 hover:underline"
                      >
                        {d.title || "—"}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {d.description || ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <PublishBadge value={!!d.publish} />
                        <AdminStatusBadge value={d.approvedByAdmin} />
                        <span className="text-xs text-gray-500">
                          {fmtDate(d.$createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/edit/${d.type}/${d.$id}`)}
                        className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 ring-1 ring-gray-300 hover:bg-gray-50 whitespace-nowrap"
                        title="Edit"
                      >
                        <Pencil className="mr-1 inline-block h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeletePost(d)}
                        disabled={busy}
                        className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20 hover:bg-rose-100"
                        title="Delete"
                      >
                        <Trash2 className="mr-1 inline-block h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {!d.publish && (
                      <button
                        onClick={() => onTogglePublish(d, true)}
                        disabled={busy}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100"
                      >
                        <ToggleRight className="h-4 w-4" />
                        Publish
                      </button>
                    )}
                    {d.publish && (
                      <button
                        onClick={() => onTogglePublish(d, false)}
                        disabled={busy}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-gray-50 text-gray-800 ring-1 ring-gray-300 hover:bg-gray-100"
                      >
                        <ToggleLeft className="h-4 w-4" />
                        Unpublish
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop table */}
          <section
            className="mt-8 hidden overflow-hidden rounded-3xl border border-gray-100 bg-white md:block"
            style={{
              boxShadow:
                "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
            }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                My Listings (Table)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Type</Th>
                    <Th>Title</Th>
                    <Th>Created</Th>
                    <Th>Publish</Th>
                    <Th>Admin Status</Th>
                    <Th className="text-right pr-5">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {rows.map((d) => {
                    const busy = !!busyMap[d.$id];
                    return (
                      <tr key={d.$id} className="hover:bg-gray-50/60">
                        <Td className="capitalize">{readableType(d.type)}</Td>
                        <Td>
                          <Link
                            to={`/${d.type}/${d.$id}`}
                            className="font-semibold text-gray-900 hover:underline"
                          >
                            {d.title || "—"}
                          </Link>
                          <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                            {d.description || ""}
                          </div>
                        </Td>
                        <Td>{fmtDate(d.$createdAt)}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <PublishBadge value={!!d.publish} />
                            {!d.publish && (
                              <button
                                onClick={() => onTogglePublish(d, true)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100"
                                title="Publish"
                              >
                                <ToggleRight className="h-4 w-4" />
                                Publish
                              </button>
                            )}
                            {d.publish && (
                              <button
                                onClick={() => onTogglePublish(d, false)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-gray-50 text-gray-800 ring-1 ring-gray-300 hover:bg-gray-100"
                                title="Unpublish"
                              >
                                <ToggleLeft className="h-4 w-4" />
                                Unpublish
                              </button>
                            )}
                          </div>
                        </Td>
                        <Td>
                          <AdminStatusBadge value={d.approvedByAdmin} />
                        </Td>
                        <Td className="text-right pr-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/edit/${d.type}/${d.$id}`)
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-800 ring-1 ring-gray-300 hover:bg-gray-50"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => onDeletePost(d)}
                              disabled={busy}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-600/20 hover:bg-rose-100"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ---------- UI atoms ---------- */

const Th = ({ children, className = "" }) => (
  <th
    scope="col"
    className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-4 align-top text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

function PublishBadge({ value }) {
  if (value) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/20">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-400/30">
      <XCircle className="h-3.5 w-3.5" />
      Not published
    </span>
  );
}

function AdminStatusBadge({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Approved
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20">
        <XCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
      <Clock className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

const Header = ({ counts }) => (
  <div
    className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#fff6f5] to-white p-6 sm:p-8"
    style={{
      boxShadow: "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
    }}
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Posts
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          A quick overview of everything you've listed.
        </p>
      </div>

      <Link
        to="/post-listing"
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ ["--accent"]: ACCENT }}
      >
        <Plus size={16} />
        Post a listing
      </Link>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      <Stat label="Total" value={counts.total} />
      <Stat label="Jobs" value={counts.jobs} />
      <Stat label="Rooms" value={counts.rooms} />
      <Stat label="Market" value={counts.market} />
      <Stat label="Events" value={counts.events} />
    </div>
  </div>
);

const EmptyState = ({ title, subtitle, ctaText, ctaTo }) => (
  <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gray-50">
      <FolderOpen className="h-5 w-5 text-gray-500" />
    </div>
    <h2 className="mt-4 text-xl font-bold text-gray-900">{title}</h2>
    <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
    <Link
      to={ctaTo}
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      style={{ ["--accent"]: ACCENT }}
    >
      {ctaText}
    </Link>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs font-semibold text-gray-500">{label}</div>
  </div>
);

/* ---------- utils ---------- */
function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
function readableType(t) {
  switch (t) {
    case "jobs":
      return "Jobs";
    case "rooms":
      return "Rooms";
    case "market":
      return "Market";
    case "events":
      return "Events";
    default:
      return t || "—";
  }
}
