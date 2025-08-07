import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile";
import { getFilePreview } from "../../../appwrite/storage";
import conf from "../../../conf/conf";

import ImageUploader from "../../ImageUploader/ImageUploader";

const MarketEditForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [marketItem, setMarketItem] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState([]);

  // Check user login
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

  // Fetch existing market data
  useEffect(() => {
    const fetchMarketItem = async () => {
      try {
        const item = await listingService.getDocument(
          conf.appWriteCollectionIdMarket,
          id
        );

        setMarketItem(item);

        if (item) {
          reset({
            title: item.title,
            description: item.description,
            price: item.price,
            location: item.location,
            contact: item.contact,
            condition: item.condition,
          });

          if (item.imageIds?.length > 0) {
            const urls = item.imageIds.map((fileId) => ({
              id: fileId,
              preview: getFilePreview(fileId),
            }));
            setExistingImages(urls);
            
              console.log("Resolved previews:", urls);
            setExistingImages(urls);
          }
        }
      } catch (error) {
        console.error("Error fetching market item:", error);
        alert("Failed to load market listing.");
      }
    };

    if (id) fetchMarketItem();
  }, [id, reset]);


  // Submit handler
  const onSubmit = async (data) => {
    if (!user) {
      alert("Please log in to update a listing.");
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
        imageIds: [
          ...(existingImages.map((img) => img.id)), // only the images that are left
          ...uploadedImageIds,
        ],
        postedBy: JSON.stringify(user),
        publish: true,
      };

      await listingService.updateDocument(
        conf.appWriteCollectionIdMarket,
        id,
        marketData,
      );

      navigate(`/market/${id}`);
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert("Error: Could not update market listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-6 heading-primary">
        Edit Market Listing
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
            Price
          </label>
          <input
            id="price"
            type="number"
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
            type="text"
            {...register("contact", { required: "Contact info is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs">{errors.contact.message}</p>
          )}
        </div>

        {/* Condition */}
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
    </div>
  );
};

export default MarketEditForm;
