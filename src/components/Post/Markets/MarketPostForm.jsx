import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../../appwrite/config"; // Adjust path as needed
import authService from "../../../appwrite/auth"; // Adjust path as needed
import { uploadImages } from "../../../utils/uploadFile"; // Adjust path as needed
import conf from "../../../conf/conf";

import ImageUploader from "../../ImageUploader/ImageUploader";

const MarketPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [user, setUser] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

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



  // Handle form submission
  const onSubmit = async (data) => {
    if (!user) {
      alert("Please log in to create a listing.");
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageIds = [];

      if (selectedFiles.length > 0) {
        uploadedImageIds = await uploadImages(selectedFiles);
      }

      const marketData = {
        title: data.title,
        description: data.description,
        type: "market",
        price: parseInt(data.price),
        location: data.location,
        contact: data.contact,
        condition: data.condition,
        imageIds: uploadedImageIds,
        postedBy: JSON.stringify(user),
        publish: true,
      };
      await listingService.createDocument(
        marketData,
        conf.appWriteCollectionIdMarket
      );
      navigate("/market");
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Error: Could not create market listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-6 heading-primary">
        Create Market Listing
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Item Title"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe the item"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold mb-2">
            Price
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
            placeholder="Location"
            {...register("location", { required: "Location is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.location && (
            <p className="text-red-500 text-xs">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-semibold mb-2">
            Contact Info
          </label>
          <input
            id="contact"
            type="text"
            placeholder="Contact Number"
            {...register("contact", { required: "Contact info is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs">{errors.contact.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-semibold mb-2"
          >
            Condition
          </label>
          <select
            id="condition"
            {...register("condition", {
              required: "Item condition is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
          {errors.condition && (
            <p className="text-red-500 text-xs">{errors.condition.message}</p>
          )}
        </div>

        {/* Image Upload */}

        <ImageUploader
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        <button
          type="submit"
          className="w-full py-4 mt-4 text-white font-semibold rounded-md bg-[rgba(212,17,56,1)] hover:bg-[rgba(212,17,56,0.8)] transition cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default MarketPostForm;
