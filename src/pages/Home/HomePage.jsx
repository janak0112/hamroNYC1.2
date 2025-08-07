// pages/HomePage.jsx
import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import HeroBanner from "./Components/HeroBanner";
import CategoryTiles from "./Components/CategoryTiles";
import PostSection from "./Components/PostSection";

function HomePage() {
  const { jobs, rooms, market, loading, error, events } =
    useContext(DataContext);
  const items = [jobs, rooms, market, events];

  return (
    <div className="space-y-6 content-wrapper">
      <HeroBanner />
      <CategoryTiles />
      {items.map((item, i) => (
        <PostSection
          key={i}
          title={`Latest ${
            item[0] &&
            item[0].type.charAt(0).toUpperCase() +
              item[0].type.slice(1).toLowerCase()
          }`}
          data={item}
          loading={loading}
          error={error}
          link="/jobs"
        />
      ))}
    </div>
  );
}

export default HomePage;
