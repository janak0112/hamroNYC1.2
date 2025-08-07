import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile"; // Utility function
import { Storage } from "appwrite";
import Modal from "../../Modals/Modal";
import conf from "../../../conf/conf";
import { getFilePreview } from "../../../appwrite/storage";

import ImageUploader from "../../ImageUploader/ImageUploader";

const EventEditForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
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

  const storage = new Storage();

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

  // ✅ Fetch event and format data
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
          
            console.log("Resolved previews:", urls);
          setExistingImages(urls);
        }
      } catch (error) {
        console.error("❌ Failed to fetch event:", error);
        setErrorMessage("Could not load event data.");
      }
    };
    if (id) fetchEvent();
  }, [id, reset]);

  // ✅ Handle submit
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
        imageIds: [
          ...(existingImages.map((img) => img.id)), // only the images that are left
          ...uploadedImageIds,
        ],
        postedBy: JSON.stringify(postedBy).slice(0, 999),
      };

      const response = await listingService.updateDocument(
        conf.appWriteCollectionIdEvents,
        id,
        eventData
      );


      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/event/${id}`);
      }, 3000);
    } catch (error) {
      console.error("❌ Error updating event:", error);
      setErrorMessage("Failed to update event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-6 heading-primary">
        Edit Event
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Event Title"
            {...register("title", { required: "Event title is required" })}
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
            placeholder="Describe the event"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* Event Mode */}
        <div>
          <label className="block text-sm font-semibold mb-2">Event Mode</label>
          <select
            {...register("eventMode", { required: "Please select event mode" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select Mode --</option>
            <option value="inPerson">In-Person</option>
            <option value="online">Online</option>
          </select>
          {errors.eventMode && (
            <p className="text-red-500 text-xs">{errors.eventMode.message}</p>
          )}
        </div>

        {/* Location (In-Person only) */}
        {eventMode === "inPerson" && (
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold mb-2"
            >
              Event Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Event Location"
              {...register("location", { required: "Location is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.location && (
              <p className="text-red-500 text-xs">{errors.location.message}</p>
            )}
          </div>
        )}

        {/* Online Link (Online only) */}
        {eventMode === "online" && (
          <div>
            <label
              htmlFor="onlineLink"
              className="block text-sm font-semibold mb-2"
            >
              Online Meeting Link
            </label>
            <input
              id="onlineLink"
              type="url"
              placeholder="https://zoom.us/meeting-link"
              {...register("onlineLink", {
                required: "Online link is required for online events",
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.onlineLink && (
              <p className="text-red-500 text-xs">
                {errors.onlineLink.message}
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block text-sm font-semibold mb-2">
            Contact Info
          </label>
          <input
            id="contact"
            type="text"
            placeholder="Contact Info"
            {...register("contact", { required: "Contact info is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs">{errors.contact.message}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="eventDate"
              className="block text-sm font-semibold mb-2"
            >
              Event Date
            </label>
            <input
              id="eventDate"
              type="date"
              min={today}
              {...register("eventDate", { required: "Event date is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.eventDate && (
              <p className="text-red-500 text-xs">{errors.eventDate.message}</p>
            )}
          </div>

          <div className="flex-1">
            <label
              htmlFor="eventTime"
              className="block text-sm font-semibold mb-2"
            >
              Event Time
            </label>
            <input
              id="eventTime"
              type="time"
              {...register("eventTime", { required: "Event time is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.eventTime && (
              <p className="text-red-500 text-xs">{errors.eventTime.message}</p>
            )}
          </div>
        </div>

        {/* Ticket Option */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Ticket Option
          </label>
          <select
            {...register("ticketOption", {
              required: "Please select an option",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select --</option>
            <option value="free">Free Entry</option>
            <option value="paid">Paid Ticket</option>
          </select>
          {errors.ticketOption && (
            <p className="text-red-500 text-xs">
              {errors.ticketOption.message}
            </p>
          )}
        </div>

        {/* Ticket Cost */}
        {ticketOption === "paid" && (
          <div>
            <label
              htmlFor="ticketCost"
              className="block text-sm font-semibold mb-2"
            >
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
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.ticketCost && (
              <p className="text-red-500 text-xs">
                {errors.ticketCost.message}
              </p>
            )}
          </div>
        )}

        {/* Ticket Link */}
        <div>
          <label
            htmlFor="ticketLink"
            className="block text-sm font-semibold mb-2"
          >
            Ticket / Registration Link (optional)
          </label>
          <input
            id="ticketLink"
            type="url"
            placeholder="https://eventbrite.com/your-event"
            {...register("ticketLink")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
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
          className="w-full py-4 mt-4 text-white font-semibold rounded-md bg-[rgba(212,17,56,1)] hover:bg-[rgba(212,17,56,0.8)] transition cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating Event..." : "Update Event"}
        </button>
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
