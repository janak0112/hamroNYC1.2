import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile";
import Modal from "../../Modals/Modal";
import conf from "../../../conf/conf";

const JobPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      salary: "",
      salaryType: "hourly",
      location: "",
      contactNumber: "",
      contactEmail: "",
      jobType: "full-time",
      company: "",
      checkOnly: false,
      jobLink: "",
    },
  });

  const [userId, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // Watch phone and email fields
  const contactNumber = watch("contactNumber");
  const contactEmail = watch("contactEmail");

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

    // Validate either phone or email is provided
    if (!data.contactNumber && !data.contactEmail) {
      setErrorMessage("Please provide either a contact number or an email.");
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
        salaryType: data.salaryType,
        location: data.location,
        contactNumber: data.contactNumber || null,
        contactEmail: data.contactEmail || null,
        company: data.company,
        jobType: data.jobType,
        jobLink: data.jobLink || null,
        checkOnly: data.checkOnly,
        imageIds: uploadedImageIds,
        userId,
        publish: true,
      };

      const response = await listingService.createDocument(
        jobData,
        conf.appWriteCollectionIdJobs
      );
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
    <div className="container mx-auto px-6 py-20 content-wrapper">
      <h2 className="text-3xl font-bold text-center mb-6 heading-primary">
        Create Job Listing
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4"
      >
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
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

        {/* Salary with Type */}
        <div>
          <label htmlFor="salary" className="block text-sm font-semibold mb-2">
            Salary
          </label>
          <div className="flex gap-2">
            <input
              id="salary"
              type="number"
              step="0.01"
              placeholder="Enter Salary"
              {...register("salary", {
                required: "Salary is required",
                min: 0,
              })}
              className="w-2/3 p-2 border border-gray-300 rounded-md"
            />
            <select
              id="salaryType"
              {...register("salaryType")}
              className="w-1/3 p-2 border border-gray-300 rounded-md"
            >
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {errors.salary && (
            <p className="text-red-500 text-xs">{errors.salary.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold mb-2">
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

        {/* Contact Number */}
        <div>
          <label
            htmlFor="contactNumber"
            className="block text-sm font-semibold mb-2"
          >
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="tel"
            placeholder="Contact Number"
            {...register("contactNumber", {
              pattern: {
                value: /^[0-9+\-\s]+$/,
                message: "Invalid contact number",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-xs">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-semibold mb-2">
            Contact Email
          </label>
          <input
            id="contactEmail"
            type="email"
            placeholder="Contact Email"
            {...register("contactEmail", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-xs">
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        {/* Validation message for either phone or email */}
        {!contactNumber && !contactEmail && (
          <p className="text-red-500 text-xs">
            Please provide at least a contact number or an email.
          </p>
        )}

        {/* Job Type */}
        <div>
          <label htmlFor="jobType" className="block text-sm font-semibold mb-2">
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

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold mb-2">
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

        {/* Job Application Link */}
        <div>
          <label htmlFor="jobLink" className="block text-sm font-semibold mb-2">
            Job Application Link (Optional)
          </label>
          <input
            id="jobLink"
            type="url"
            placeholder="https://apply-link.com"
            {...register("jobLink", {
              pattern: {
                value:
                  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                message: "Please enter a valid URL",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.jobLink && (
            <p className="text-red-500 text-xs">{errors.jobLink.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-semibold mb-2">
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

        {/* Remote Only Option */}
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
          className="w-full py-4 mt-4 text-white font-semibold rounded-md bg-[rgba(212,17,56,1)] hover:bg-[rgba(212,17,56,0.8)] transition cursor-pointer disabled:bg-gray-400"
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
