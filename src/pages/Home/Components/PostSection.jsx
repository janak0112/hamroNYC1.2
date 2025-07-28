// components/PostSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";

const PostSection = ({ title, data = [], loading, error, link }) => (
  <section className="container mx-auto px-6 mb-10">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Link to={link} className="text-blue-500 hover:underline">
        View All
      </Link>
    </div>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : data.length === 0 ? (
      <p className="text-gray-500">No {title.toLowerCase()} available.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((post) => (
          <PostCard key={post.$id} post={post} />
        ))}
      </div>
    )}
  </section>
);

export default PostSection;
