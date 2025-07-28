import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile"; // Utility function
import Modal from "../../Modals/Modal";

const JobPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      salary: "",
      location: "",
      contact: "",
      jobType: "full-time",
      experienceRequired: 0,
      company: "",
      checkOnly: false,
      userId: "",
    },
  });

  const [userId, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

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
      setErrorMessage("Please log in to create a job listing.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageIds = [];

      if (selectedFiles.length > 0) {
        uploadedImageIds = await uploadImages(selectedFiles);
      }

      const jobData = {
        title: data.title,
        description: data.description,
        salary: data.salary,
        location: data.location,
        contact: data.contact,
        experienceRequired: data.experienceRequired,
        company: data.company,
        checkOnly: data.checkOnly,
        imageIds: uploadedImageIds,
        userId,
        publish: true,
      };

      const response = await listingService.createJobListing(jobData);
      console.log("Job listing created:", response);

      reset();
      setSelectedFiles([]);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/jobs");
      }, 3000);
    } catch (error) {
      console.error("Error creating job listing:", error);
      setErrorMessage(error.message || "Failed to create job listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Job Listing
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-semibold">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Job Title"
            {...register("title", {
              required: "Title is required",
              maxLength: 100,
            })}
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
            placeholder="Describe the job role"
            {...register("description", {
              required: "Description is required",
              maxLength: 500,
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-semibold">
            Salary
          </label>
          <input
            id="salary"
            type="number"
            step="0.01"
            placeholder="Salary"
            {...register("salary", { required: "Salary is required", min: 0 })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.salary && (
            <p className="text-red-500 text-xs">{errors.salary.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Job Location"
            {...register("location", {
              required: "Location is required",
              maxLength: 200,
            })}
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
            {...register("contact", {
              required: "Contact info is required",
              pattern: {
                value: /^[0-9+\-\s]+$/,
                message: "Invalid contact number",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs">{errors.contact.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobType" className="block text-sm font-semibold">
            Job Type
          </label>
          <select
            id="jobType"
            {...register("jobType", { required: "Job type is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="temporary">Temporary</option>
          </select>
          {errors.jobType && (
            <p className="text-red-500 text-xs">{errors.jobType.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="experienceRequired"
            className="block text-sm font-semibold"
          >
            Experience Required (in years)
          </label>
          <input
            id="experienceRequired"
            type="number"
            placeholder="Experience Required"
            {...register("experienceRequired", {
              required: "Experience is required",
              min: 0,
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.experienceRequired && (
            <p className="text-red-500 text-xs">
              {errors.experienceRequired.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-semibold">
            Company
          </label>
          <input
            id="company"
            type="text"
            placeholder="Company Name"
            {...register("company", {
              required: "Company is required",
              maxLength: 100,
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.company && (
            <p className="text-red-500 text-xs">{errors.company.message}</p>
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

        <div className="mt-4 flex items-center space-x-2">
          <input
            id="checkOnly"
            type="checkbox"
            {...register("checkOnly")}
            className="h-4 w-4"
          />
          <label htmlFor="checkOnly" className="text-sm font-semibold">
            Remote Only
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isSubmitting || !userId}
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

export default JobPostForm;
