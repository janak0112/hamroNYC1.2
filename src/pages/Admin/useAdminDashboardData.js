// src/hooks/useAdminDashboardData.js
import { useMemo } from "react";

export default function useAdminDashboardData(posts, rangeStart) {
  // filter by range
  const filtered = useMemo(() => {
    const list = posts || [];
    if (!rangeStart) return list;
    return list.filter((p) => new Date(p.$createdAt) >= rangeStart);
  }, [posts, rangeStart]);

  // status counts
  const statusCounts = useMemo(() => {
    let pending = 0,
      approved = 0,
      unapproved = 0;
    for (const p of filtered) {
      if (p.approvedByAdmin === true) approved++;
      else if (p.approvedByAdmin === false) unapproved++;
      else pending++;
    }
    return { total: filtered.length, pending, approved, unapproved };
  }, [filtered]);

  // type breakdown
  const TYPES = ["rooms", "jobs", "market", "events", "travelCompanion"];
  const typeCounts = useMemo(() => {
    const m = Object.fromEntries(TYPES.map((t) => [t, 0]));
    for (const p of filtered) {
      if (m[p.type] !== undefined) m[p.type]++;
    }
    return m;
  }, [filtered]);

  // series for sparkline
  const series = useMemo(() => {
    const start = rangeStart
      ? new Date(rangeStart)
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() - 13);
          d.setHours(0, 0, 0, 0);
          return d;
        })();
    const days = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    while (cursor <= end) {
      days.push({ key: cursor.toISOString().slice(0, 10), count: 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    const idx = Object.fromEntries(days.map((d, i) => [d.key, i]));
    for (const p of filtered) {
      const k = new Date(p.$createdAt).toISOString().slice(0, 10);
      if (idx[k] !== undefined) days[idx[k]].count++;
    }
    return days;
  }, [filtered, rangeStart]);

  // trend vs previous day
  const trend = useMemo(() => {
    if (series.length < 2) return 0;
    const last = series[series.length - 1]?.count ?? 0;
    const prev = series[series.length - 2]?.count ?? 0;
    if (prev === 0 && last === 0) return 0;
    if (prev === 0) return 100;
    return Math.round(((last - prev) / prev) * 100);
  }, [series]);

  // contributors
  const contributors = useMemo(() => {
    const map = new Map();
    for (const p of filtered) {
      const postedBy =
        typeof p.postedBy === "string" ? safeParse(p.postedBy) : p.postedBy;
      const name = (postedBy?.name || "Unknown").trim();
      map.set(name, (map.get(name) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [filtered]);

  // queue: (we’ll pass ALL filtered posts to UI; it will do status tab filtering)
  const queue = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
    );
  }, [filtered]);

  return {
    filtered,
    statusCounts,
    typeCounts,
    series,
    trend,
    contributors,
    queue,
  };
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
