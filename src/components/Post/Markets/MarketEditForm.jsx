import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile";
import { getFilePreview } from "../../../appwrite/storage";
import conf from "../../../conf/conf";
import ImageUploader from "../../ImageUploader/ImageUploader";

const ACCENT = "#CD4A3D";

const MarketEditForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [marketItem, setMarketItem] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const condition = watch("condition");

  // Auth check
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
            condition: item.condition || "used",
          });

          if (item.imageIds?.length > 0) {
            const urls = item.imageIds.map((fileId) => ({
              id: fileId,
              preview: getFilePreview(fileId),
            }));
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
        price: parseInt(data.price, 10),
        location: data.location,
        contact: data.contact,
        condition: data.condition,
        imageIds: [...existingImages.map((img) => img.id), ...uploadedImageIds],
        postedBy: JSON.stringify(user),
        publish: true,
      };

      await listingService.updateDocument(
        conf.appWriteCollectionIdMarket,
        id,
        marketData
      );

      navigate(`/market/${id}`);
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert("Error: Could not update market listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI helpers
  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-gray-900/10";
  const labelBase = "mb-1 block text-sm font-semibold text-gray-800";
  const fieldError = (msg) =>
    msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      {/* Header Card */}
      <div
        className="overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#eef3ff] to-white p-6 sm:p-8"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Edit{" "}
          <span
            className="text-[var(--accent,#2563EB)]"
            style={{ ["--accent"]: ACCENT }}
          >
            Market
          </span>{" "}
          Listing
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Update item details, condition, and images.
        </p>

        {/* Segmented: Condition */}
        <div className="mt-5">
          <label className={labelBase}>Condition</label>
          <div className="inline-grid grid-cols-3 rounded-2xl border border-gray-200 bg-white p-1">
            {[
              { id: "new", label: "New" },
              { id: "used", label: "Used" },
              { id: "refurbished", label: "Refurbished" },
            ].map(({ id: val, label }) => (
              <button
                type="button"
                key={val}
                onClick={() =>
                  setValue("condition", val, { shouldValidate: true })
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  condition === val
                    ? "bg-[var(--accent,#2563EB)] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ ["--accent"]: ACCENT }}
              >
                {label}
              </button>
            ))}
          </div>
          {fieldError(errors.condition?.message)}
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.03), 0 8px 24px rgba(16,24,40,.06)",
        }}
      >
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className={labelBase}>
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="iPhone 13, gently used"
            {...register("title", { required: "Title is required" })}
            className={inputBase}
          />
          {fieldError(errors.title?.message)}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className={labelBase}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the item, condition, included accessories, etc."
            {...register("description", {
              required: "Description is required",
            })}
            className={`${inputBase} min-h-[110px]`}
          />
          {fieldError(errors.description?.message)}
        </div>

        {/* Price & Location */}
        <div className="mb-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelBase}>
              Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="350"
              {...register("price", { required: "Price is required" })}
              className={inputBase}
            />
            {fieldError(errors.price?.message)}
          </div>
          <div>
            <label htmlFor="location" className={labelBase}>
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Jackson Heights, NY"
              {...register("location", { required: "Location is required" })}
              className={inputBase}
            />
            {fieldError(errors.location?.message)}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label htmlFor="contact" className={labelBase}>
            Contact Info
          </label>
          <input
            id="contact"
            type="text"
            placeholder="+1 555 555 5555"
            {...register("contact", { required: "Contact info is required" })}
            className={inputBase}
          />
          {fieldError(errors.contact?.message)}
        </div>

        {/* Hidden select (kept for validation parity with segmented) */}
        <select
          {...register("condition", { required: "Item condition is required" })}
          className="hidden"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>

        {/* Image Upload */}
        <div className="mt-4">
          <ImageUploader
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
          />
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent,#2563EB)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ ["--accent"]: ACCENT }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Listing…" : "Update Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarketEditForm;
