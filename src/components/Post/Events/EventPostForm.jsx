import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../../appwrite/config"; // Adjust the path as needed
import authService from "../../../appwrite/auth"; // Adjust path for auth service

const EventPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = localStorage.getItem("userId");
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const onSubmit = async (data) => {
    if (!user) {
      alert("You need to be logged in to create a post.");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        title: data.title,
        description: data.description,
        category: "event", // Explicitly setting category to event
        location: data.location,
        contact: data.contact,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        imageId: null, // You can add image upload functionality later
      };

      // Create the event listing
      // const response = await listingService.createEventListing(eventData);
      // console.log("Event listing created:", response);

      // Redirect to the event listings page (or anywhere you prefer)
      // navigate("/events");
      console.log(eventData);
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

        {/* Image Upload Section */}
        {/* You can add image upload functionality here later */}
        <div className="mt-4">
          <label htmlFor="image" className="block text-sm font-semibold">
            Upload Image (Optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default EventPostForm;
