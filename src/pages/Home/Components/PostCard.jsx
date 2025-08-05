// components/PostCard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/uploadFile"; // adjust path if needed
import { Eye, Edit, Trash } from "lucide-react";

import ModalView from "../../../components/Modals/ModalView";
import EventDetailContent from "../../../components/Display/Events/EventDetailContent";
import conf from "../../../conf/conf";
import { DataContext } from "../../../context/DataContext";

const PostCard = ({ post }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { handleDeleteDocument, authUser } = useContext(DataContext);
  const navigate = useNavigate()

  useEffect(() => {
    if (post.imageIds && post.imageIds.length > 0) {
      const url = getImageUrl(post.imageIds[0]); // get URL for first image
      setImageUrl(url);
    }
  }, [post.imageIds]);


  // Check if logged-in user is the owner
  const isOwner = authUser && post.postedBy && JSON.parse(post.postedBy).id === authUser;


  // Delete handler
  const handleDeleteEvent = async () => {
    setLoadingDelete(true);
    try {
      await handleDeleteDocument(conf.appWriteCollectionIdEvents, post.$id);
      setShowDeleteModal(false);
      navigate("/events");
    } catch (error) {
      console.error("❌ Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setLoadingDelete(false);
    }
  };


  const handleViewClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  console.log("posttt", post)

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

      {/* Edit/Delete Buttons - Only if owner */}
      {isOwner && (
        <div className="flex justify-start gap-5 group-hover:opacity-100 transition mb-4">
          {/* View */}
          <Link className="flex justify-center flex-col items-center text-sm text-[rgb(205,74,61)] hover:text-red-700" onClick={handleViewClick}>
            <Eye size={20} />
            view
          </Link>

          {/* Edit */}
          <Link to={`/${post.type}-edit/${post.$id}`} className="flex justify-center flex-col items-center text-sm text-[rgb(205,74,61)] hover:text-red-700">
            <Edit size={20} />
            Edit
          </Link>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex justify-center flex-col items-center text-[rgb(205,74,61)] hover:text-red-700"
          >
            <Trash size={20} />
            Delete
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold">{post.title || "Untitled Post"}</h3>
      <p className="mt-2 text-gray-500">
        {post.description || "No description available."}
      </p>
      <Link
        to={`/${post.type}/${post.$id}`}
        className="text-sm text-white font-bold custom-primary-bg rounded-md px-4 py-2 custom-primary-bg-hover mt-4 inline-block"
      >
        View Details
      </Link>

      <ModalView isVisible={showModal} onClose={closeModal}>
        <EventDetailContent event={post} imageUrl={[imageUrl]} />
      </ModalView>


      {/* Delete Confirmation Modal */}
      <ModalView className="max-w-xl" isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-6">Are you sure you want to delete this {`${post.type}`}?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={loadingDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </ModalView>

    </div>
  );
};

export default PostCard;


