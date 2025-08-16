// src/components/Forms/Rooms/RoomEditForm.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../../../appwrite/config";
import { uploadImages } from "../../../utils/uploadFile";
import { getFilePreview } from "../../../appwrite/storage";
import conf from "../../../conf/conf";
import { checkUserLoggedIn } from "../../../utils/authUtils";
import ImageUploader from "../../ImageUploader/ImageUploader";
import DateField from "../../DateField/DateField";
import { toast } from "react-toastify";

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

/* ------- tiny UI helpers (same as RoomPostForm) ------- */
const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-gray-800">
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
/* ------------------------------------------------------ */

/** Normalize any Date/string to YYYY-MM-DD in local time */
function normalizeDate(value) {
  if (!value) return "";
  const d = new Date(value);
  // shift to local date (strip timezone) so split("T")[0] is correct
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

const RoomEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
  } = useForm();

  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isStudio, setIsStudio] = useState(false);

  const studioWatch = watch("isStudio"); // "true" | "false"

  /* Auth (match RoomPostForm pattern) */
  useEffect(() => {
    checkUserLoggedIn({ navigate }).then((u) => {
      if (u) setUser({ id: u.$id, name: u.name });
    });
  }, [navigate]);

  /* Fetch existing room document */
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await listingService.getDocument(
          conf.appWriteCollectionIdRooms,
          id
        );

        reset({
          title: room.title ?? "",
          description: room.description ?? "",
          price: room.price ?? 0,
          location: room.location ?? "",
          contact: room.contact ?? "",
          bedrooms: room.bedrooms ?? (room.isStudio ? 1 : 0),
          bathrooms: room.bathrooms ?? (room.isStudio ? 1 : 0),
          furnishing: !!room.furnishing,
          availableFrom: room.availableFrom
            ? String(room.availableFrom).split("T")[0]
            : "",
          isStudio: String(!!room.isStudio), // "true" | "false"
          utilitiesIncluded: !!room.utilitiesIncluded,
        });

        setIsStudio(!!room.isStudio);

        if (room.imageIds?.length) {
          const urls = room.imageIds.map((fileId) => ({
            id: fileId,
            preview: getFilePreview(fileId),
          }));
          setExistingImages(urls);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setErrorMessage("Failed to load room data.");
      }
    };

    if (id) fetchRoom();
  }, [id, reset]);

  /* Keep local studio state in sync like RoomPostForm */
  useEffect(() => {
    if (studioWatch === "true" && !isStudio) {
      setIsStudio(true);
      setValue("bedrooms", 1);
      setValue("bathrooms", 1);
    }
    if (studioWatch === "false" && isStudio) {
      setIsStudio(false);
    }
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
    if (!user) {
      setErrorMessage("Please log in to update a room listing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const uploadedImageIds = selectedFiles.length
        ? await uploadImages(selectedFiles)
        : [];

      // merge & dedupe image IDs
      const mergedImageIds = Array.from(
        new Set([...existingImages.map((img) => img.id), ...uploadedImageIds])
      );

      const roomData = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        price: data.price ? String(data.price) : "0",
        location: data.location?.trim(),
        contact: data.contact?.trim(),
        bedrooms: Number.parseInt(data.bedrooms, 10) || 0,
        bathrooms: Number.parseInt(data.bathrooms, 10) || 0,
        furnishing: !!data.furnishing,
        availableFrom: data.availableFrom, // already YYYY-MM-DD
        isStudio: data.isStudio === "true",
        utilitiesIncluded: !!data.utilitiesIncluded,
        imageIds: mergedImageIds,
        // Do NOT override moderation fields on edit:
        // postedBy, publish, etc. are intentionally untouched
      };

      await listingService.updateDocument(
        conf.appWriteCollectionIdRooms,
        id,
        roomData
      );

      toast.success("Room updated successfully");
      setSelectedFiles([]);
      navigate(`/rooms/${id}`);
    } catch (error) {
      console.error("Error updating room listing:", error);
      setErrorMessage(error?.message || "Failed to update room listing.");
      toast.error("Failed to update room listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero / Header (styled like RoomPostForm) */}
      <div
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#fff6f5] to-white"
        style={{
          boxShadow: "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl ring-1 ring-[var(--accent,#CD4A3D)]/20"
                style={{ background: "rgba(205,74,61,.08)", ["--accent"]: ACCENT }}
              >
                <Home className="h-5 w-5 text-[var(--accent,#CD4A3D)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Edit Room Listing
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Keep details accurate—good listings get approved faster.
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
              Keep rent fair; note deposits or utilities included.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4" /> Location
              </div>
              Mention area & nearby transit for better reach.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <CalendarDays className="h-4 w-4" /> Availability
              </div>
              Set the earliest move-in date clearly.
            </div>
          </div>
        </div>

        {/* Top-level error */}
        {errorMessage && (
          <div className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-10">
            {errorMessage}
          </div>
        )}

        {/* Form card */}
        <div className="border-t border-gray-100 bg-white/70 px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basics */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title" required>Title</Label>
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
                <Label htmlFor="description" required>Description</Label>
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
                <Label htmlFor="price" required>Price (per month)</Label>
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
                <Label htmlFor="contact" required>Contact Info</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="Phone / WhatsApp / Messenger"
                    className="pl-9"
                    {...register("contact", {
                      required: "Contact info is required",
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "Invalid contact number",
                      },
                      validate: (value) => {
                        const digits = (value || "").replace(/\D/g, "");
                        return (
                          digits.length <= 15 ||
                          "Contact number must be 15 digits or less"
                        );
                      },
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
                <Label htmlFor="location" required>Location</Label>
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
                <Label htmlFor="availableFrom" required>Available From</Label>
                <Controller
                  name="availableFrom"
                  control={control}
                  rules={{ required: "Availability date is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <DateField
                        id="availableFrom"
                        value={field.value}
                        onChange={(v) => field.onChange(normalizeDate(v))}
                        minDate={new Date()}
                        placeholder="Select date"
                        error={!!fieldState.error}
                      />
                      <FieldError message={fieldState.error?.message} />
                    </>
                  )}
                />
              </div>
            </section>

            {/* Studio + Beds/Baths */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="isStudio" required>Is this a Studio?</Label>
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
                  <Label htmlFor="bedrooms" required>Bedrooms</Label>
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
                        min: { value: isStudio ? 1 : 0, message: "Invalid value" },
                      })}
                      error={!!errors.bedrooms}
                    />
                  </div>
                  <FieldError message={errors.bedrooms?.message} />
                </div>

                <div>
                  <Label htmlFor="bathrooms" required>Bathrooms</Label>
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
                        min: { value: isStudio ? 1 : 0, message: "Invalid value" },
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
                <input type="checkbox" {...register("utilitiesIncluded")} className="h-4 w-4" />
                <span className="text-sm font-semibold">Utilities Included</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("furnishing")} className="h-4 w-4" />
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
                Add bright photos of the room and common areas. First image becomes the cover.
              </p>
              <ImageUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                existingImages={existingImages}
                setExistingImages={setExistingImages}
              />
            </section>

            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> We only promote properties with no agent fees.
            </p>

            {/* Submit */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent,#CD4A3D)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                style={{ ["--accent"]: ACCENT }}
              >
                {isSubmitting ? "Updating Listing..." : "Update Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomEditForm;
