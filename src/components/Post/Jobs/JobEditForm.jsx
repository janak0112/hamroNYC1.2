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

const JobEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  const [userId, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [jobItem, setJobItem] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // watch fields
  const contactNumber = watch("contactNumber");
  const contactEmail = watch("contactEmail");
  const salaryType = watch("salaryType");
  const jobType = watch("jobType");

  // Auth check
  useEffect(() => {
    (async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser({ id: currentUser.$id, name: currentUser.name });
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.error("Auth error:", e);
        navigate("/login");
      }
    })();
  }, [navigate]);

  // Fetch job + hydrate form
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await listingService.getDocument(
          conf.appWriteCollectionIdJobs,
          id
        );
        setJobItem(job);

        reset({
          title: job.title,
          description: job.description,
          salary: job.salary,
          salaryType: job.salaryType || "hourly",
          location: job.location,
          contactNumber: job.contactNumber || "",
          contactEmail: job.contactEmail || "",
          company: job.company,
          jobType: job.jobType || "full-time",
          jobLink: job.jobLink || "",
          checkOnly: job.checkOnly || false,
        });

        if (job.imageIds?.length) {
          const urls = job.imageIds.map((fileId) => ({
            id: fileId,
            preview: getFilePreview(fileId),
          }));
          setExistingImages(urls);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setErrorMessage("Failed to load job data.");
      }
    };

    if (id) fetchJob();
  }, [id, reset]);

  // Submit
  const onSubmit = async (data) => {
    if (!userId) {
      setErrorMessage("Please log in to update a job listing.");
      return;
    }
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
        type: "job",
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
        checkOnly: data.checkOnly || false,
        imageIds: [...existingImages.map((img) => img.id), ...uploadedImageIds],
        postedBy: JSON.stringify(userId).slice(0, 999),
        publish: true,
      };

      await listingService.updateDocument(
        conf.appWriteCollectionIdJobs,
        id,
        jobData
      );

      setSelectedFiles([]);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/jobs/${id}`);
      }, 1200);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.message || "Failed to update job listing.");
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
            Job
          </span>{" "}
          Listing
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Update details, adjust salary type, and manage images.
        </p>

        {/* Segmented: Job Type */}
        <div className="mt-5">
          <label className={labelBase}>Job Type</label>
          <div className="inline-grid grid-cols-3 rounded-2xl border border-gray-200 bg-white p-1">
            {[
              { id: "full-time", label: "Full-Time" },
              { id: "part-time", label: "Part-Time" },
              { id: "temporary", label: "Temporary" },
            ].map(({ id: val, label }) => (
              <button
                type="button"
                key={val}
                onClick={() =>
                  setValue("jobType", val, { shouldValidate: true })
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  jobType === val
                    ? "bg-[var(--accent,#2563EB)] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ ["--accent"]: ACCENT }}
              >
                {label}
              </button>
            ))}
          </div>
          {fieldError(errors.jobType?.message)}
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
            Job Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Barista / Cashier"
            {...register("title", {
              required: "Title is required",
              maxLength: 100,
            })}
            className={inputBase}
          />
          {fieldError(errors.title?.message)}
        </div>

        {/* Company */}
        <div className="mb-4">
          <label htmlFor="company" className={labelBase}>
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
            className={inputBase}
          />
          {fieldError(errors.company?.message)}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className={labelBase}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the job role"
            {...register("description", {
              required: "Description is required",
              maxLength: 500,
            })}
            className={`${inputBase} min-h-[110px]`}
          />
          {fieldError(errors.description?.message)}
        </div>

        {/* Salary + Salary Type (segmented) */}
        <div className="mb-2 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="salary" className={labelBase}>
              Salary
            </label>
            <input
              id="salary"
              type="number"
              step="0.01"
              placeholder="Enter salary"
              {...register("salary", {
                required: "Salary is required",
                min: 0,
              })}
              className={inputBase}
            />
            {fieldError(errors.salary?.message)}
          </div>

          <div>
            <label className={labelBase}>Salary Type</label>
            <div className="inline-grid grid-cols-3 rounded-2xl border border-gray-200 bg-white p-1">
              {["hourly", "monthly", "yearly"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setValue("salaryType", opt, { shouldValidate: true })
                  }
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition capitalize ${
                    salaryType === opt
                      ? "bg-[var(--accent,#2563EB)] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ ["--accent"]: ACCENT }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className={labelBase}>
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Jackson Heights, NY"
            {...register("location", {
              required: "Location is required",
              maxLength: 200,
            })}
            className={inputBase}
          />
          {fieldError(errors.location?.message)}
        </div>

        {/* Contact */}
        <div className="mb-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactNumber" className={labelBase}>
              Contact Number
            </label>
            <input
              id="contactNumber"
              type="tel"
              placeholder="+1 555 555 5555"
              {...register("contactNumber", {
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Invalid contact number",
                },
              })}
              className={inputBase}
            />
            {fieldError(errors.contactNumber?.message)}
          </div>
          <div>
            <label htmlFor="contactEmail" className={labelBase}>
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              placeholder="you@example.com"
              {...register("contactEmail", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className={inputBase}
            />
            {fieldError(errors.contactEmail?.message)}
          </div>
        </div>

        {/* Either phone or email hint */}
        {!contactNumber && !contactEmail && (
          <p className="mb-2 text-xs text-red-600">
            Please provide at least a contact number or an email.
          </p>
        )}

        {/* Job Link */}
        <div className="mb-4">
          <label htmlFor="jobLink" className={labelBase}>
            Job Application Link (optional)
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
            className={inputBase}
          />
          {fieldError(errors.jobLink?.message)}
        </div>

        {/* Image Uploader */}
        <div className="mt-4">
          <ImageUploader
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
          />
        </div>

        {/* Remote Only */}
        <div className="mt-5 flex items-center gap-2">
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

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent,#2563EB)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ ["--accent"]: ACCENT }}
            disabled={isSubmitting || !userId}
          >
            {isSubmitting ? "Updating Listing…" : "Update Listing"}
          </button>
        </div>
      </form>

      {/* Success */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Job Listing Updated!"
        message="Your job has been successfully updated. Redirecting…"
      />

      {/* Error */}
      <Modal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage("")}
        title="Error"
        message={errorMessage}
      />
    </div>
  );
};

export default JobEditForm;
