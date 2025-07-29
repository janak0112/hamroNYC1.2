import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile"; // Utility function
import Modal from "../../Modals/Modal";
import conf from "../../../conf/conf";

const EventPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [userId, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser.$id);
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

  const onSubmit = async (data) => {
    if (!userId) {
      setErrorMessage("Please log in to create a Events listing.");
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
        // category: "event", // Explicitly setting category to event
        location: data.location,
        contact: data.contact,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        imageIds: uploadedImageIds,
        userId,
      };

      const response = await listingService.createDocument(
        eventData,
        conf.appWriteCollectionIdEvents
      );
      console.log("Events listing created:", response);

      reset();
      setSelectedFiles([]);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        // navigate("/events");
      }, 3000);
    } catch (error) {
      console.error("Error creating event listing:", error);
      alert("Failed to create event listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Event Listing
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-semibold">
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

        <div>
          <label htmlFor="description" className="block text-sm font-semibold">
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

        <div>
          <label htmlFor="location" className="block text-sm font-semibold">
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

        <div>
          <label htmlFor="contact" className="block text-sm font-semibold">
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

        <div>
          <label htmlFor="eventDate" className="block text-sm font-semibold">
            Event Date
          </label>
          <input
            id="eventDate"
            type="date"
            {...register("eventDate", { required: "Event date is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.eventDate && (
            <p className="text-red-500 text-xs">{errors.eventDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="eventTime" className="block text-sm font-semibold">
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

        <div>
          <label htmlFor="images" className="block text-sm font-semibold">
            Upload Images (Max 5)
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 5);
              setSelectedFiles(files);
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {selectedFiles.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedFiles.length} image(s) selected
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Job Listing Created!"
        message="Your job has been successfully posted. Redirecting to job listings..."
      />

      <Modal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage("")}
        title="Error"
        message={errorMessage}
      />
    </div>
  );
};

export default EventPostForm;
