import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { DataContext } from "../../context/DataContext";
import {
  Shield,
  MonitorCheck,
  Info,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { cardBase } from "./ui"; // tokens path as in your project

import useAdminDashboardData from "./useAdminDashboardData";
import RangeChips from "./RangeChips";
import KPI from "./KPI";
import SparklineCard from "./SparklineCard";
import TypeBreakdown from "./TypeBreakdown";
import Contributors from "./Contributors";
import ModerationQueue from "./ModerationQueue";

export default function AdminDashboard() {
  const {
    posts,
    loading,
    error,
    approveDocument,
    declineDocument,
    isAdmin,
    adminMode,
    setAdminMode,
  } = useContext(DataContext);

  useEffect(() => {
    setAdminMode?.(true);
  }, [setAdminMode]);

  const canModerate =
    (typeof isAdmin === "boolean" ? isAdmin : undefined) ?? !!adminMode;

  // range filter (logic here)
  const [range, setRange] = useState("30d"); // '7d' | '30d' | 'all'
  const now = useMemo(() => new Date(), []);
  const rangeStart = useMemo(() => {
    if (range === "all") return null;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (range === "7d") d.setDate(d.getDate() - 6);
    if (range === "30d") d.setDate(d.getDate() - 29);
    return d;
  }, [range]);

  // derive everything via hook (logic separated)
  const { statusCounts, typeCounts, series, trend, contributors, queue } =
    useAdminDashboardData(posts, rangeStart);

  const handleApprove = useCallback(
    async (item) => {
      await approveDocument(item.$collectionId, item.$id);
    },
    [approveDocument]
  );

  const handleDecline = useCallback(
    async (item) => {
      await declineDocument(item.$collectionId, item.$id);
    },
    [declineDocument]
  );

  if (!canModerate) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className={`${cardBase} p-10 text-center`}>
          <Shield className="mx-auto mb-3 h-8 w-8 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">Admins only</h2>
          <p className="mt-1 text-sm text-gray-600">
            You don’t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            Admin · Dashboard
          </h1>
          <RangeChips range={range} onChange={setRange} />
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI
          title="Total Posts"
          value={statusCounts.total}
          icon={MonitorCheck}
          sub={rangeLabel(range, now)}
          trend={trend}
        />
        <KPI title="Pending" value={statusCounts.pending} icon={Info} />
        <KPI
          title="Unapproved"
          value={statusCounts.unapproved}
          icon={XCircle}
        />
        <KPI
          title="Approved"
          value={statusCounts.approved}
          icon={CheckCircle2}
        />
      </section>

      {/* Chart + Type breakdown + Contributors */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SparklineCard series={series} />
          <TypeBreakdown typeCounts={typeCounts} />
        </div>
        <Contributors contributors={contributors} />
      </section>

      {/* Moderation Queue (presentational handles status tabs internally) */}
      <ModerationQueue
        queue={queue} // pass ALL filtered posts; component filters by status tab
        rangeLabelText={rangeLabel(range, now)}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />

      {/* Loading / Error */}
      {loading && <p className="text-sm text-gray-600">Loading…</p>}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm text-rose-700">Error: {error}</p>
        </div>
      )}
    </div>
  );
}

function rangeLabel(range, now) {
  const d = now.toLocaleDateString();
  if (range === "7d") return `Last 7 days · as of ${d}`;
  if (range === "30d") return `Last 30 days · as of ${d}`;
  return `All-time · as of ${d}`;
}
