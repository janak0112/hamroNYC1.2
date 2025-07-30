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
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [userId, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const ticketOption = watch("ticketOption");
  const eventMode = watch("eventMode"); // Online vs In-Person toggle

  const today = new Date().toISOString().split("T")[0];

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
      setErrorMessage("Please log in to create an Events listing.");
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
        {/* Title */}
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

        {/* Description */}
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

        {/* Event Mode */}
        <div>
          <label className="block text-sm font-semibold">Event Mode</label>
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

        {/* Location (Only if In-Person) */}
        {eventMode === "inPerson" && (
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
        )}

        {/* Online Link (Only if Online) */}
        {eventMode === "online" && (
          <div>
            <label htmlFor="onlineLink" className="block text-sm font-semibold">
              Online Meeting Link
            </label>
            <input
              id="onlineLink"
              type="url"
              placeholder="https://zoom.us/meeting-link"
              {...register("onlineLink", {
                required: "Online link is required for online events",
                pattern: {
                  value:
                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                  message: "Please enter a valid URL",
                },
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

        {/* Event Date */}
        <div>
          <label htmlFor="eventDate" className="block text-sm font-semibold">
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

        {/* Event Time */}
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

        {/* Ticket Option */}
        <div>
          <label className="block text-sm font-semibold">Ticket Option</label>
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
            <label htmlFor="ticketCost" className="block text-sm font-semibold">
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

        {/* Ticket/Register Link */}
        <div>
          <label htmlFor="ticketLink" className="block text-sm font-semibold">
            Ticket / Registration Link (optional)
          </label>
          <input
            id="ticketLink"
            type="url"
            placeholder="https://eventbrite.com/your-event"
            {...register("ticketLink", {
              pattern: {
                value:
                  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                message: "Please enter a valid URL",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.ticketLink && (
            <p className="text-red-500 text-xs">{errors.ticketLink.message}</p>
          )}
        </div>

        {/* Image Upload */}
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

        {/* Submit Button */}
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
        title="Event Listing Created!"
        message="Your event has been successfully posted."
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
