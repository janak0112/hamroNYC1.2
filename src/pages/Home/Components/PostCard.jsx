// components/PostCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/uploadFile"; // adjust path if needed

const PostCard = ({ post }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (post.imageIds && post.imageIds.length > 0) {
      const url = getImageUrl(post.imageIds[0]); // get URL for first image
      setImageUrl(url);
    }
  }, [post.imageIds]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all p-6">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={post.title || "Post image"}
          className="w-full h-48 object-cover mb-4 rounded"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
      <h3 className="text-lg font-semibold">{post.title || "Untitled Post"}</h3>
      <p className="mt-2 text-gray-500">
        {post.description || "No description available."}
      </p>
      <Link
        to={`/${post.type}/${post.$id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        View Details
      </Link>
    </div>
  );
};

export default PostCard;
