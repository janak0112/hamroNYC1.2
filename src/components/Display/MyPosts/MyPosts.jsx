import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import PostSection from "../../../pages/Home/Components/PostSection";
import { Loader2, Plus, FolderOpen } from "lucide-react";

const ACCENT = "#CD4A3D";

const MyPosts = () => {
  const { jobs, rooms, market, events, loading, error, authUser } =
    useContext(DataContext);

  const { slug } = useParams(); // e.g. "jobs" if you deep-link to a section
  const loggedInUserId = authUser; // assuming this is already the user id

  const [filtered, setFiltered] = useState({
    jobs: [],
    rooms: [],
    market: [],
    events: [],
  });

  
  // safer postedBy parsing
  const byUser = (list, userId) =>
    (list || []).filter((post) => {
      try {
        const pb =
          typeof post.postedBy === "string"
            ? JSON.parse(post.postedBy)
            : post.postedBy;
            return pb?.id === userId;
      } catch {
        return false;
      }
    });
    
    useEffect(() => {
      if (!loading && loggedInUserId) {
        setFiltered({
          jobs: byUser(jobs, loggedInUserId),
          rooms: byUser(rooms, loggedInUserId),
          market: byUser(market, loggedInUserId),
          events: byUser(events, loggedInUserId),
        });
      }
    }, [slug, jobs, rooms, market, events, loggedInUserId, loading]);
    
    const counts = useMemo(
      () => ({
        jobs: filtered.jobs.length,
        rooms: filtered.rooms.length,
        market: filtered.market.length,
        events: filtered.events.length,
        total:
        filtered.jobs.length +
        filtered.rooms.length +
        filtered.market.length +
        filtered.events.length,
    }),
    [filtered]
    );
    
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
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Header counts={counts} />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6"
              style={{
                boxShadow:
                  "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
              }}
            >
              <div className="h-5 w-1/2 rounded bg-gray-100" />
              <div className="mt-3 h-4 w-2/3 rounded bg-gray-100" />
              <div className="mt-6 h-24 rounded-xl bg-gray-100" />
            </div>
          ))}
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

  const sections = [
    { key: "jobs", title: "Jobs", data: filtered.jobs, link: "/jobs" },
    { key: "rooms", title: "Rooms", data: filtered.rooms, link: "/rooms" },
    { key: "market", title: "Market", data: filtered.market, link: "/market" },
    { key: "events", title: "Events", data: filtered.events, link: "/events" },
  ];

  // If slug is provided (/my-posts/jobs), show only that section
  const visible = slug
    ? sections.filter((s) => s.key === slug)
    : sections.filter((s) => s.data.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Header counts={counts} />

      {counts.total === 0 ? (
        <EmptyState
          title="You haven't posted anything yet"
          subtitle="Create your first listing and it will show up here."
          ctaText="Post a listing"
          ctaTo="/post-listing"
        />
      ) : (
        <div className="space-y-10">
          {visible.map((item) => (
            <SectionCard
              key={item.key}
              title={`My ${item.title}`}
              link={item.link}
            >
              <PostSection
                data={item.data}
                loading={false}
                error={null}
                // Keep your original deep links
                link={`/my-posts${item.link}`}
              />
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- small presentational pieces ---------------- */

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

    {/* counts */}
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      <Stat label="Total" value={counts.total} />
      <Stat label="Jobs" value={counts.jobs} />
      <Stat label="Rooms" value={counts.rooms} />
      <Stat label="Market" value={counts.market} />
      <Stat label="Events" value={counts.events} />
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs font-semibold text-gray-500">{label}</div>
  </div>
);

const SectionCard = ({ title, link, children }) => (
  <section
    className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
    style={{
      boxShadow: "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)",
    }}
  >
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <Link
        to={link}
        className="text-sm font-semibold text-gray-800 underline-offset-2 hover:underline"
      >
        View all
      </Link>
    </div>
    <div className="p-4">{children}</div>
  </section>
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

export default MyPosts;
