// pages/HomePage.jsx
import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import HeroBanner from "./Components/HeroBanner";
import CategoryTiles from "./Components/CategoryTiles";
import PostSection from "./Components/PostSection";

function HomePage() {
  const { jobs, rooms, market, events, loading, error } =
    useContext(DataContext);

  // curate sections intentionally (order matters)
  const sections = [
    { key: "rooms", title: "Latest Rooms", link: "/rooms", data: rooms },
    { key: "jobs", title: "Latest Jobs", link: "/jobs", data: jobs },
    { key: "market", title: "Latest Market", link: "/market", data: market },
    { key: "events", title: "Upcoming Events", link: "/events", data: events },
  ];

  // change this if you want more/less per section
  const LIMIT = 6;

  const allEmpty =
    !loading && !error && sections.every((s) => !s.data || s.data.length === 0);

  return (
    <div className="content-wrapper space-y-8">
      <HeroBanner />
      <CategoryTiles />

      <div className="mx-auto max-w-6xl px-4">
        {sections.map(({ key, title, link, data }) =>
          data && data.length > 0 ? (
            <PostSection
              key={key}
              title={title}
              data={data.slice(0, LIMIT)}
              loading={loading}
              error={error}
              link={link}
            />
          ) : null
        )}

        {allEmpty && (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              No listings yet. Be the first to post and your items will appear
              here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
