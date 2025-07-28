// pages/HomePage.jsx
import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import HeroBanner from "./Components/HeroBanner";
import CategoryTiles from "./Components/CategoryTiles";
import PostSection from "./Components/PostSection";
import { Link } from "react-router-dom";
import Footer from "./Components/Footer";

function HomePage() {
  const { jobs, rooms, market, loading, error } = useContext(DataContext);
  console.log(jobs);

  return (
    <div className="space-y-6">
      <HeroBanner />
      <CategoryTiles />
      <PostSection
        title="Latest Jobs"
        data={jobs}
        loading={loading}
        error={error}
        link="/jobs"
      />
      <PostSection
        title="Latest Rooms"
        data={rooms}
        loading={loading}
        error={error}
        link="/rooms"
      />
      <PostSection
        title="Latest Market Posts"
        data={market}
        loading={loading}
        error={error}
        link="/market"
      />

      <Footer />
    </div>
  );
}

export default HomePage;
