import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../../appwrite/config"; // Adjust the path as needed
import authService from "../../../appwrite/auth"; // Adjust path for auth service
import Modal from "../../Modals/Modal";

const RoomPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStudio, setIsStudio] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
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
      // You can open the error modal here as well
      setShowErrorModal(true);
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const roomData = {
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        contact: data.contact,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        furnishing: data.furnishing,
        availableFrom: data.availableFrom,
        isStudio: Boolean(data.isStudio),
        utilitiesIncluded: data.utilitiesIncluded,
        user: user,
        publish: true,
      };
  
      const response = await listingService.createListings(roomData);
      console.log("Room listing created:", response);
  
      // Clear the form and update states after success
      reset();
      setIsStudio(false);
      setShowSuccessModal(true);

      // Optional: Redirect after a delay
      // setTimeout(() => {
      //   setShowSuccessModal(false);
      //   navigate("/rooms"); 
      // }, 3000);
    } catch (error) {
      console.error("Error creating room listing:", error);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStudioChange = (e) => {
    const value = e.target.value === "true"; // Convert the string value to a boolean
    setIsStudio(value);

    // Reset the values of bedrooms and bathrooms if studio is selected
    if (value) {
      setValue("bedrooms", 1); // Set default value for studio
      setValue("bathrooms", 1); // Set default value for studio
    }
  };

  // useEffect(() => {
  //   if (showSuccessModal) {
  //     const timer = setTimeout(() => {
  //       setShowSuccessModal(false);
  //       // navigate("/rooms");
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showSuccessModal, navigate]);
  
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Room Listing
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        {/* -- Form fields remain the same -- */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Room Title"
            {...register("title", { required: "Title is required" })}
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
            placeholder="Describe the room"
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
          <label htmlFor="price" className="block text-sm font-semibold">
            Price (per month)
          </label>
          <input
            id="price"
            type="number"
            placeholder="Price"
            {...register("price", { required: "Price is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Room Location"
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
            type="tel"
            placeholder="Contact Number"
            {...register("contact", { required: "Contact info is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs">{errors.contact.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-semibold">
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              placeholder="Number of Bedrooms"
              {...register("bedrooms", {
                required: "Number of bedrooms is required",
                disabled: isStudio,
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.bedrooms && (
              <p className="text-red-500 text-xs">{errors.bedrooms.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-semibold">
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              placeholder="Number of Bathrooms"
              {...register("bathrooms", {
                required: "Number of bathrooms is required",
                disabled: isStudio,
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.bathrooms && (
              <p className="text-red-500 text-xs">{errors.bathrooms.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="availableFrom"
            className="block text-sm font-semibold"
          >
            Available From
          </label>
          <input
            id="availableFrom"
            type="date"
            {...register("availableFrom", {
              required: "Availability date is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.availableFrom && (
            <p className="text-red-500 text-xs">
              {errors.availableFrom.message}
            </p>
          )}
        </div>

        {/* Studio Selection */}
        <div className="mt-4">
          <label className="block text-sm font-semibold">Studio?</label>
          <select
            {...register("isStudio", {
              required: "Studio selection is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleStudioChange}
          >
            <option value="false">Not a Studio</option>
            <option value="true">Studio</option>
          </select>
          {errors.isStudio && (
            <p className="text-red-500 text-xs">{errors.isStudio.message}</p>
          )}
        </div>

        {/* Utilities and Furnishing */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            id="utilitiesIncluded"
            type="checkbox"
            {...register("utilitiesIncluded")}
            className="h-4 w-4"
          />
          <label htmlFor="utilitiesIncluded" className="text-sm font-semibold">
            Utilities Included
          </label>
          <div className="flex items-center">
            <input
              id="furnished"
              type="checkbox"
              {...register("furnishing", {
                defaultValue: false,
              })}
              className="h-4 w-4"
            />
            <label htmlFor="furnished" className="ml-2 text-sm">
              Furnished
            </label>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          <strong>Disclaimer:</strong> We only promote properties with no agent fees.
        </p>
        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>

      {/* Render the notification modals */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Room Listing Created!"
        message="Your room has been successfully posted."
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message="Failed to create room listing."
      />
    </div>
  );
};

export default RoomPostForm;

