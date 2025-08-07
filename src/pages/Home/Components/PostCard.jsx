import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/uploadFile";
import { Eye, Edit, Trash } from "lucide-react";
import ModalView from "../../../components/Modals/ModalView";
import EventDetailContent from "../../../components/Display/Events/EventDetailContent";
import conf from "../../../conf/conf";
import { DataContext } from "../../../context/DataContext";
import NoImg from "../../../assets/img/noimage.png";

const PostCard = ({ post }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { handleDeleteDocument, authUser } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (post.imageIds && post.imageIds.length > 0) {
      const url = getImageUrl(post.imageIds[0]);
      setImageUrl(url);
    }
  }, [post.imageIds]);

  const isOwner =
    authUser && post.postedBy && JSON.parse(post.postedBy).id === authUser;

  const handleDeletePost = async () => {
    setLoadingDelete(true);
    try {
      let collectionId;
      switch (post.type) {
        case "jobs":
          collectionId = conf.appWriteCollectionIdJobs;
          break;
        case "events":
          collectionId = conf.appWriteCollectionIdEvents;
          break;
        case "rooms":
          collectionId = conf.appWriteCollectionIdRooms;
          break;
        case "market":
          collectionId = conf.appWriteCollectionIdMarket;
          break;
        default:
          throw new Error("Unknown post type");
      }

      await handleDeleteDocument(collectionId, post.$id);
      setShowDeleteModal(false);
      navigate(`/${post.type}s`);
    } catch (error) {
      console.error(`❌ Error deleting ${post.type}:`, error);
      alert(`Failed to delete ${post.type}. Please try again.`);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden w-72">
      <img
        src={imageUrl ? imageUrl : NoImg}
        alt={post.title || "Post"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-base mb-1 truncate">
          {post.title || "Untitled Post"}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {post.description || "No description available."}
        </p>

        <Link
          to={`/${post.type}/${post.$id}`}
          className="text-sm text-[#CD4A3D] font-semibold hover:underline mt-2 inline-block"
        >
          View details
        </Link>
      </div>

      {/* Action buttons (shown only for owner on hover) */}
      {isOwner && (
        <div className="absolute top-2 right-2 flex gap-2 bg-white bg-opacity-80 p-1 rounded-lg shadow-md">
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-600 hover:text-blue-600"
          >
            <Eye size={18} />
          </button>
          <Link
            to={`/${post.type}-edit/${post.$id}`}
            className="text-gray-600 hover:text-yellow-600"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash size={18} />
          </button>
        </div>
      )}

      {/* Modals */}
      <ModalView isVisible={showModal} onClose={() => setShowModal(false)}>
        <EventDetailContent event={post} imageUrl={[imageUrl]} />
      </ModalView>

      <ModalView
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p className="mb-4">
            Are you sure you want to delete this {post.type}?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePost}
              disabled={loadingDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
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
