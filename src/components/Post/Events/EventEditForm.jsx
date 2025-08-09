import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile";
import Modal from "../../Modals/Modal";
import conf from "../../../conf/conf";
import { getFilePreview } from "../../../appwrite/storage";

import ImageUploader from "../../ImageUploader/ImageUploader";

const ACCENT = "#CD4A3D";

const EventEditForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [postedBy, setUser] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [eventDoc, setEventDoc] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const ticketOption = watch("ticketOption");
  const eventMode = watch("eventMode");
  const today = new Date().toISOString().split("T")[0];

  // ✅ Check logged-in user
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
        console.error("Error checking user:", error);
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  // ✅ Fetch event and hydrate the form
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const doc = await listingService.getDocument(
          conf.appWriteCollectionIdEvents,
          id
        );
        setEventDoc(doc);

        reset({
          ...doc,
          eventDate: doc.eventDate
            ? new Date(doc.eventDate).toISOString().split("T")[0]
            : "",
          eventTime: doc.eventTime
            ? new Date(doc.eventTime).toISOString().substring(11, 16)
            : "",
        });

        if (doc.imageIds?.length > 0) {
          const urls = doc.imageIds.map((fileId) => ({
            id: fileId,
            preview: getFilePreview(fileId),
          }));
          setExistingImages(urls);
        }
      } catch (error) {
        console.error("❌ Failed to fetch event:", error);
        setErrorMessage("Could not load event data.");
      }
    };
    if (id) fetchEvent();
  }, [id, reset]);

  // ✅ Submit update
  const onSubmit = async (data) => {
    if (!postedBy) {
      setErrorMessage("Please log in to update an Event listing.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageIds = [];
      if (selectedFiles.length > 0) {
        uploadedImageIds = await uploadImages(selectedFiles);
      }

      const eventData = {
        title: data.title,
        description: data.description,
        location: data.eventMode === "inPerson" ? data.location : null,
        contact: data.contact,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        ticketOption: data.ticketOption,
        ticketCost: data.ticketOption === "paid" ? data.ticketCost : null,
        ticketLink: data.ticketLink || null,
        eventMode: data.eventMode,
        onlineLink: data.eventMode === "online" ? data.onlineLink : null,
        imageIds: [...existingImages.map((img) => img.id), ...uploadedImageIds],
        postedBy: JSON.stringify(postedBy).slice(0, 999),
      };

      await listingService.updateDocument(
        conf.appWriteCollectionIdEvents,
        id,
        eventData
      );

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/event/${id}`);
      }, 1200);
    } catch (error) {
      console.error("❌ Error updating event:", error);
      setErrorMessage("Failed to update event.");
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
            Event
          </span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Update details, switch between in-person and online, and manage
          images.
        </p>

        {/* Segmented: Event Mode */}
        <div className="mt-5">
          <label className={labelBase}>Event Mode</label>
          <div className="inline-grid grid-cols-2 rounded-2xl border border-gray-200 bg-white p-1">
            {[
              { id: "inPerson", label: "In-Person" },
              { id: "online", label: "Online" },
            ].map(({ id: val, label }) => (
              <button
                type="button"
                key={val}
                onClick={() =>
                  setValue("eventMode", val, { shouldValidate: true })
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  watch("eventMode") === val
                    ? "bg-[var(--accent,#2563EB)] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ ["--accent"]: ACCENT }}
              >
                {label}
              </button>
            ))}
          </div>
          {fieldError(errors.eventMode?.message)}
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
            Event Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Nepal Day Celebration"
            {...register("title", { required: "Event title is required" })}
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
            placeholder="Describe the event"
            {...register("description", {
              required: "Description is required",
            })}
            className={`${inputBase} min-h-[110px]`}
          />
          {fieldError(errors.description?.message)}
        </div>

        {/* Conditional: Location / Online Link */}
        {eventMode === "inPerson" && (
          <div className="mb-4">
            <label htmlFor="location" className={labelBase}>
              Event Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="123 Main St, Queens, NY"
              {...register("location", { required: "Location is required" })}
              className={inputBase}
            />
            {fieldError(errors.location?.message)}
          </div>
        )}

        {eventMode === "online" && (
          <div className="mb-4">
            <label htmlFor="onlineLink" className={labelBase}>
              Online Meeting Link
            </label>
            <input
              id="onlineLink"
              type="url"
              placeholder="https://zoom.us/your-link"
              {...register("onlineLink", {
                required: "Online link is required for online events",
              })}
              className={inputBase}
            />
            {fieldError(errors.onlineLink?.message)}
          </div>
        )}

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

        {/* Date & Time */}
        <div className="mb-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="eventDate" className={labelBase}>
              Event Date
            </label>
            <input
              id="eventDate"
              type="date"
              min={today}
              {...register("eventDate", { required: "Event date is required" })}
              className={inputBase}
            />
            {fieldError(errors.eventDate?.message)}
          </div>

          <div>
            <label htmlFor="eventTime" className={labelBase}>
              Event Time
            </label>
            <input
              id="eventTime"
              type="time"
              {...register("eventTime", { required: "Event time is required" })}
              className={inputBase}
            />
            {fieldError(errors.eventTime?.message)}
          </div>
        </div>

        {/* Segmented: Ticket Option */}
        <div className="mt-4">
          <label className={labelBase}>Ticket Option</label>
          <div className="inline-grid grid-cols-2 rounded-2xl border border-gray-200 bg-white p-1">
            {[
              { id: "free", label: "Free Entry" },
              { id: "paid", label: "Paid Ticket" },
            ].map(({ id: val, label }) => (
              <button
                type="button"
                key={val}
                onClick={() =>
                  setValue("ticketOption", val, { shouldValidate: true })
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  watch("ticketOption") === val
                    ? "bg-[var(--accent,#2563EB)] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ ["--accent"]: ACCENT }}
              >
                {label}
              </button>
            ))}
          </div>
          {fieldError(errors.ticketOption?.message)}
        </div>

        {/* Ticket Cost (Paid only) */}
        {ticketOption === "paid" && (
          <div className="mt-4">
            <label htmlFor="ticketCost" className={labelBase}>
              Ticket Cost ($)
            </label>
            <input
              id="ticketCost"
              type="number"
              step="0.01"
              placeholder="Enter ticket price"
              {...register("ticketCost", {
                required: "Ticket cost is required for paid events",
                min: { value: 0, message: "Cost cannot be negative" },
              })}
              className={inputBase}
            />
            {fieldError(errors.ticketCost?.message)}
          </div>
        )}

        {/* Ticket Link */}
        <div className="mt-4">
          <label htmlFor="ticketLink" className={labelBase}>
            Ticket / Registration Link (optional)
          </label>
          <input
            id="ticketLink"
            type="url"
            placeholder="https://eventbrite.com/your-event"
            {...register("ticketLink")}
            className={inputBase}
          />
        </div>

        {/* Image Upload */}
        <div className="mt-6">
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
            {isSubmitting ? "Updating Event…" : "Update Event"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Event Updated!"
        message="Your event has been successfully updated."
      />

      {/* Error Modal */}
      <Modal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage("")}
        title="Error"
        message={errorMessage}
      />
    </div>
  );
};

export default EventEditForm;
