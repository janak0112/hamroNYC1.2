import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createDocumentWithToast } from "../../../utils/documentUtils";
import { checkUserLoggedIn } from "../../../utils/authUtils";
import { uploadImages } from "../../../utils/uploadFile";
import conf from "../../../conf/conf";
import ImageUploader from "../../ImageUploader/ImageUploader";
import {
  Home,
  DollarSign,
  MapPin,
  Phone,
  BedDouble,
  Bath,
  CalendarDays,
} from "lucide-react";

const ACCENT = "#CD4A3D";

/* tiny UI helpers (same pattern as other forms) */
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

const RoomPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isStudio, setIsStudio] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const studioWatch = watch("isStudio"); // keep RHF in sync with toggle

  useEffect(() => {
    checkUserLoggedIn({ navigate }).then((u) => {
      if (u) setUser({ id: u.$id, name: u.name });
    });
  }, [navigate]);

  useEffect(() => {
    // keep local state aligned if user changes select directly
    if (studioWatch === "true" && !isStudio) {
      setIsStudio(true);
      setValue("bedrooms", 1);
      setValue("bathrooms", 1);
    }
    if (studioWatch === "false" && isStudio) setIsStudio(false);
  }, [studioWatch, isStudio, setValue]);

  const handleStudioChange = (e) => {
    const value = e.target.value === "true";
    setIsStudio(value);
    if (value) {
      setValue("bedrooms", 1);
      setValue("bathrooms", 1);
    }
  };

  const onSubmit = async (data) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const uploadedImageIds = selectedFiles.length
        ? await uploadImages(selectedFiles)
        : [];

      const roomData = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        price: data.price ? Number(data.price) : 0,
        location: data.location?.trim(),
        contact: data.contact?.trim(),
        bedrooms: parseInt(data.bedrooms, 10),
        bathrooms: parseInt(data.bathrooms, 10),
        furnishing: !!data.furnishing,
        availableFrom: data.availableFrom,
        isStudio: data.isStudio === "true",
        utilitiesIncluded: !!data.utilitiesIncluded,
        imageIds: uploadedImageIds,
        postedBy: JSON.stringify(user),
        publish: true,
      };

      await createDocumentWithToast(
        roomData,
        conf.appWriteCollectionIdRooms,
        navigate,
        "/rooms"
      );
      reset();
      setSelectedFiles([]);
    } catch (err) {
      console.error("Room creation failed", err);
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
                <Home className="h-5 w-5 text-[var(--accent,#CD4A3D)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Create Room Listing
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Share a room, studio, or entire space with the community.
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
              Rooms
            </div>
          </div>

          {/* Helper strip */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <DollarSign className="h-4 w-4" /> Price
              </div>
              Monthly rent + what’s included builds trust.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4" /> Location
              </div>
              Add neighborhood and nearby transit if possible.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <CalendarDays className="h-4 w-4" /> Availability
              </div>
              Set the earliest move-in date.
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
                  placeholder="e.g., Sunny room near Jackson Heights"
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
                  placeholder="Describe the space, roommates, rules, lease term, deposit, etc."
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 10, message: "At least 10 characters" },
                  })}
                  error={!!errors.description}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </section>

            {/* Price & Contact */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="price" required>
                  Price (per month)
                </Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 950"
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
                <Label htmlFor="contact" required>
                  Contact Info
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="contact"
                    type="tel"
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

            {/* Location & Availability */}
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
                <Label htmlFor="availableFrom" required>
                  Available From
                </Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="availableFrom"
                    type="date"
                    min={today}
                    className="pl-9"
                    {...register("availableFrom", {
                      required: "Availability date is required",
                    })}
                    error={!!errors.availableFrom}
                  />
                </div>
                <FieldError message={errors.availableFrom?.message} />
              </div>
            </section>

            {/* Studio + Beds/Baths */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="isStudio" required>
                  Is this a Studio?
                </Label>
                <Select
                  id="isStudio"
                  {...register("isStudio", { required: true })}
                  onChange={handleStudioChange}
                >
                  <option value="false">No, not a studio</option>
                  <option value="true">Yes, studio</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms" required>
                    Bedrooms
                  </Label>
                  <div className="relative">
                    <BedDouble className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="bedrooms"
                      type="number"
                      min={isStudio ? 1 : 0}
                      className="pl-9"
                      disabled={isStudio}
                      {...register("bedrooms", {
                        required: "Bedrooms is required",
                        min: {
                          value: isStudio ? 1 : 0,
                          message: "Invalid value",
                        },
                      })}
                      error={!!errors.bedrooms}
                    />
                  </div>
                  <FieldError message={errors.bedrooms?.message} />
                </div>

                <div>
                  <Label htmlFor="bathrooms" required>
                    Bathrooms
                  </Label>
                  <div className="relative">
                    <Bath className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="bathrooms"
                      type="number"
                      min={isStudio ? 1 : 0}
                      className="pl-9"
                      disabled={isStudio}
                      {...register("bathrooms", {
                        required: "Bathrooms is required",
                        min: {
                          value: isStudio ? 1 : 0,
                          message: "Invalid value",
                        },
                      })}
                      error={!!errors.bathrooms}
                    />
                  </div>
                  <FieldError message={errors.bathrooms?.message} />
                </div>
              </div>
            </section>

            {/* Checkboxes */}
            <section className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("utilitiesIncluded")}
                  className="h-4 w-4"
                />
                <span className="text-sm font-semibold">
                  Utilities Included
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("furnishing")}
                  className="h-4 w-4"
                />
                <span className="text-sm font-semibold">Furnished</span>
              </label>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">Photos</h3>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                Add bright photos of the room and common areas. First image
                becomes the cover.
              </p>
              <ImageUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </section>

            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> We only promote properties with no
              agent fees.
            </p>

            {/* Submit */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent,#CD4A3D)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                style={{ ["--accent"]: ACCENT }}
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

export default RoomPostForm;
