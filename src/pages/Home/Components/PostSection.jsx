// components/PostSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";

const PostSection = ({ title, data = [], loading, error, link, showViewAll = true, }) => (
  <section className="container mx-auto px-6 mb-10">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold uppercase tracking-widest text-[#CD4A3D]">
        {title}
      </h2>

      {showViewAll && link ? (
        <Link to={link} className="text-[rgb(205,74,61)] hover:underline">
          View All
        </Link>
      ) : null}
    </div>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : data.length === 0 ? (
      <p className="text-gray-500">No data available.</p>
    ) : (
      <div className="flex flex-wrap gap-5 justify-right">
        {data.map((post) => (
          <PostCard key={post.$id} post={post} />
        ))}
      </div>
    )}
  </section>
);

export default PostSection;
