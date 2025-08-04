import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import Modal from "../../components/Modals/Modal";
import conf from "../../conf/conf";

const TravelPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
        });
      } else {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const onSubmit = async (data) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const travelData = {
        title: data.title,
        description: data.description,
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        dateOfTravel: data.dateOfTravel,
        contact: data.contact,
        userId: user.id,
        postedBy: JSON.stringify(user),
      };

      //   await listingService.createTravelListing(travelData);
      //   reset();
      //   setShowSuccessModal(true);
      //   setTimeout(() => {
      //     setShowSuccessModal(false);
      //     navigate("/travel");
      //   }, 3000);
    } catch (error) {
      console.error("Error creating travel companion listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-6">
        Find a Travel Companion
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}

        <textarea
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="From (e.g. JFK, NY)"
          {...register("fromLocation", {
            required: "Departure location is required",
          })}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="To (e.g. KTM, Nepal)"
          {...register("toLocation", { required: "Destination is required" })}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          {...register("dateOfTravel", { required: "Date is required" })}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Contact Info"
          {...register("contact", { required: "Contact info is required" })}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-[#CD4A3D] text-white font-semibold hover:opacity-90"
        >
          {isSubmitting ? "Posting..." : "Post Travel Companion"}
        </button>
      </form>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Posted!"
        message="Your travel companion request has been successfully posted."
      />
    </div>
  );
};

export default TravelPostForm;
