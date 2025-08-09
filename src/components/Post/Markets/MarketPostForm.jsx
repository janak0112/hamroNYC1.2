import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { checkUserLoggedIn } from "../../../utils/authUtils";
import { createDocumentWithToast } from "../../../utils/documentUtils";
import { uploadImages } from "../../../utils/uploadFile";
import conf from "../../../conf/conf";
import ImageUploader from "../../ImageUploader/ImageUploader";
import {
  Tag,
  DollarSign,
  MapPin,
  Phone,
  FileText,
  Package,
} from "lucide-react";

const ACCENT = "#CD4A3D";

/* tiny UI helpers */
const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1 block text-sm font-semibold text-gray-800"
  >
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = ({ error, className = "", ...rest }) => (
  <input
    {...rest}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
      error ? "border-red-300 focus:ring-red-100" : "border-gray-200"
    } ${className}`}
  />
);

const Textarea = ({ error, className = "", ...rest }) => (
  <textarea
    {...rest}
    rows={5}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
      error ? "border-red-300 focus:ring-red-100" : "border-gray-200"
    } ${className}`}
  />
);

const Select = ({ error, className = "", children, ...rest }) => (
  <select
    {...rest}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-gray-900/10 ${
      error ? "border-red-300 focus:ring-red-100" : "border-gray-200"
    } ${className}`}
  >
    {children}
  </select>
);

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

const MarketPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const verifyUser = async () => {
      const u = await checkUserLoggedIn({ navigate });
      if (u) setUser({ id: u.$id, name: u.name });
    };
    verifyUser();
  }, [navigate]);

  const onSubmit = async (data) => {
    if (!user?.id) {
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
        title: data.title?.trim(),
        description: data.description?.trim(),
        type: "market",
        price: data.price ? parseInt(data.price, 10) : 0,
        location: data.location?.trim(),
        contact: data.contact?.trim(),
        condition: data.condition,
        imageIds: uploadedImageIds,
        postedBy: JSON.stringify(user),
        publish: true,
      };

      createDocumentWithToast(
        marketData,
        conf.appWriteCollectionIdMarket,
        navigate
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero / Header */}
      <div
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#fff6f5] to-white"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl ring-1 ring-[var(--accent,#CD4A3D)]/20"
                style={{
                  background: "rgba(205,74,61,.08)",
                  ["--accent"]: ACCENT,
                }}
              >
                <Tag className="h-5 w-5 text-[var(--accent,#CD4A3D)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Create Market Listing
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Sell items to the Nepali community in NYC.
                </p>
              </div>
            </div>

            <div
              className="rounded-xl px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(205,74,61,.1)",
                color: ACCENT,
                border: "1px solid rgba(205,74,61,.2)",
              }}
            >
              Market
            </div>
          </div>

          {/* Helper strip */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" /> Details
              </div>
              Clear title and concise description sell faster.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <DollarSign className="h-4 w-4" /> Price
              </div>
              Set a fair price; add condition for trust.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4" /> Contact
              </div>
              Provide a phone or messaging contact to close deals.
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="border-t border-gray-100 bg-white/70 px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basics */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title" required>
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., iPhone 13 Pro, Nikon D3500, Sofa set"
                  {...register("title", {
                    required: "Title is required",
                    minLength: { value: 3, message: "At least 3 characters" },
                    maxLength: { value: 120, message: "Max 120 characters" },
                  })}
                  error={!!errors.title}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" required>
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add key details: condition, age, included accessories, pickup/delivery…"
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 10, message: "At least 10 characters" },
                  })}
                  error={!!errors.description}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </section>

            {/* Price & Condition */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="price" required>
                  Price (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 150"
                    className="pl-9"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price cannot be negative" },
                    })}
                    error={!!errors.price}
                  />
                </div>
                <FieldError message={errors.price?.message} />
              </div>

              <div>
                <Label htmlFor="condition" required>
                  Condition
                </Label>
                <Select
                  id="condition"
                  {...register("condition", {
                    required: "Item condition is required",
                  })}
                  error={!!errors.condition}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </Select>
                <FieldError message={errors.condition?.message} />
              </div>
            </section>

            {/* Location & Contact */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="location" required>
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="Neighborhood / City"
                    className="pl-9"
                    {...register("location", {
                      required: "Location is required",
                      maxLength: { value: 120, message: "Max 120 characters" },
                    })}
                    error={!!errors.location}
                  />
                </div>
                <FieldError message={errors.location?.message} />
              </div>

              <div>
                <Label htmlFor="contact" required>
                  Contact Info
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="contact"
                    type="text"
                    placeholder="Phone / WhatsApp / Messenger"
                    className="pl-9"
                    {...register("contact", {
                      required: "Contact info is required",
                    })}
                    error={!!errors.contact}
                  />
                </div>
                <FieldError message={errors.contact?.message} />
              </div>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Item Photos
                </h3>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                Add clear photos (front, back, any flaws). First image becomes
                the cover.
              </p>
              <ImageUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </section>

            {/* Submit */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent,#CD4A3D)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto disabled:bg-gray-400"
                style={{ ["--accent"]: ACCENT }}
                disabled={isSubmitting || !user?.id}
              >
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarketPostForm;
