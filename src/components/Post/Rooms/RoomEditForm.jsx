import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import Modal from "../../Modals/Modal";
import { uploadImages } from "../../../utils/uploadFile";
import { getFilePreview } from "../../../appwrite/storage";
import conf from "../../../conf/conf";

import ImageUploader from "../../ImageUploader/ImageUploader";

const RoomEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStudio, setIsStudio] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [roomItem, setRoomItem] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState([]);

  // Check if the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser({ id: currentUser.$id, name: currentUser.name });
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("User check failed:", error);
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  // Fetch existing room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await listingService.getDocument(
          conf.appWriteCollectionIdRooms,
          id
        );

        setRoomItem(room);

        if (room) {
          reset({
            title: room.title,
            description: room.description,
            price: room.price,
            location: room.location,
            contact: room.contact,
            bedrooms: room.bedrooms,
            bathrooms: room.bathrooms,
            furnishing: room.furnishing,
            availableFrom: room.availableFrom?.split("T")[0],
            isStudio: room.isStudio,
            utilitiesIncluded: room.utilitiesIncluded,
          });

          setIsStudio(room.isStudio);

          if (room.imageIds?.length > 0) {
            const urls = room.imageIds.map((fileId) => ({
              id: fileId,
              preview: getFilePreview(fileId),
            }));
            setExistingImages(urls);
            
              console.log("Resolved previews:", urls);
            setExistingImages(urls);
          }  
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        setShowErrorModal(true);
      }
    };

    if (id) fetchRoom();
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!user) {
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageIds = [];

      if (selectedFiles.length > 0) {
        uploadedImageIds = await uploadImages(selectedFiles);
      }

      const roomData = {
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        contact: data.contact,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        furnishing: data.furnishing,
        availableFrom: data.availableFrom,
        isStudio: Boolean(data.isStudio),
        utilitiesIncluded: data.utilitiesIncluded,
        imageIds: [
          ...(existingImages.map((img) => img.id)), // only the images that are left
          ...uploadedImageIds,
        ],
        postedBy: JSON.stringify(user),
        publish: true,
      };

      const response = await listingService.updateDocument(
        conf.appWriteCollectionIdRooms,
        id,
        roomData,
      );
     

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/rooms/${id}`);
      }, 3000);
    } catch (error) {
      console.error("Error updating room listing:", error);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudioChange = (e) => {
    const value = e.target.value === "true";
    setIsStudio(value);
    if (value) {
      setValue("bedrooms", 1);
      setValue("bathrooms", 1);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-6 heading-primary">
        Edit Room Listing
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Room Title"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe the room"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-semibold mb-2">
            Price (per month)
          </label>
          <input
            id="price"
            type="number"
            placeholder="Price"
            {...register("price", { required: "Price is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-semibold mb-2"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Room Location"
            {...register("location", { required: "Location is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.location && (
            <p className="text-red-500 text-xs">{errors.location.message}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block text-sm font-semibold mb-2">
            Contact Info
          </label>
          <input
            id="contact"
            type="tel"
            placeholder="Contact Number"
            {...register("contact", { required: "Contact info is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs">{errors.contact.message}</p>
          )}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-semibold mb-2"
            >
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              disabled={isStudio}
              {...register("bedrooms", { required: !isStudio })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.bedrooms && (
              <p className="text-red-500 text-xs">{errors.bedrooms.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-sm font-semibold mb-2"
            >
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              disabled={isStudio}
              {...register("bathrooms", { required: !isStudio })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.bathrooms && (
              <p className="text-red-500 text-xs">{errors.bathrooms.message}</p>
            )}
          </div>
        </div>

        {/* Available From */}
        <div>
          <label
            htmlFor="availableFrom"
            className="block text-sm font-semibold mb-2"
          >
            Available From
          </label>
          <input
            id="availableFrom"
            type="date"
            {...register("availableFrom", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.availableFrom && (
            <p className="text-red-500 text-xs">
              {errors.availableFrom.message}
            </p>
          )}
        </div>

        {/* Studio */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">Studio?</label>
          <select
            {...register("isStudio")}
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleStudioChange}
          >
            <option value="false">Not a Studio</option>
            <option value="true">Studio</option>
          </select>
        </div>

        {/* Utilities & Furnishing */}
        <div className="mt-4 flex items-center space-x-4">
          <input
            id="utilitiesIncluded"
            type="checkbox"
            {...register("utilitiesIncluded")}
            className="h-4 w-4"
          />
          <label htmlFor="utilitiesIncluded" className="text-sm font-semibold">
            Utilities Included
          </label>
          <div className="flex items-center">
            <input
              id="furnished"
              type="checkbox"
              {...register("furnishing")}
              className="h-4 w-4"
            />
            <label htmlFor="furnished" className="ml-2 text-sm">
              Furnished
            </label>
          </div>
        </div>

        {/* Images */}
        <ImageUploader
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
        />


        <button
          type="submit"
          className="w-full py-4 mt-4 text-white font-semibold rounded-md bg-[rgba(212,17,56,1)] hover:bg-[rgba(212,17,56,0.8)] transition cursor-pointer disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating Listing..." : "Update Listing"}
        </button>
      </form>

      {/* Modals */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Room Listing Updated!"
        message="Your room has been successfully updated."
      />
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message="Failed to update room listing."
      />
    </div>
  );
};

export default RoomEditForm;
