import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "../../../appwrite/auth";
import { uploadImages } from "../../../utils/uploadFile";
import Modal from "../../Modals/Modal";
import conf from "../../../conf/conf";
import { createDocumentWithToast } from "../../../utils/documentUtils";
import ImageUploader from "../../ImageUploader/ImageUploader";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Link2,
} from "lucide-react";

const ACCENT = "#CD4A3D";

/* tiny UI helpers */
const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1 block text-sm font-semibold text-gray-800"
  >
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = ({ error, className = "", ...rest }) => (
  <input
    {...rest}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
      error ? "border-red-300 focus:ring-red-100" : "border-gray-200"
    } ${className}`}
  />
);

const Textarea = ({ error, className = "", ...rest }) => (
  <textarea
    {...rest}
    rows={5}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
      error ? "border-red-300 focus:ring-red-100" : "border-gray-200"
    } ${className}`}
  />
);

const Select = ({ error, className = "", children, ...rest }) => (
  <select
    {...rest}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-gray-900/10 ${
      error ? "border-red-300 focus:ring-red-100" : "border-gray-200"
    } ${className}`}
  >
    {children}
  </select>
);

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

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
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

  const contactNumber = watch("contactNumber");
  const contactEmail = watch("contactEmail");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser({ id: currentUser.$id, name: currentUser.name });
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  const onSubmit = async (data) => {
    if (!userId?.id) {
      setErrorMessage("Please log in to create a job listing.");
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
        title: data.title?.trim(),
        description: data.description?.trim(),
        salary: data.salary ? String(data.salary) : null,
        salaryType: data.salaryType,
        location: data.location?.trim(),
        contactNumber: data.contactNumber?.trim() || null,
        contactEmail: data.contactEmail?.trim() || null,
        company: data.company?.trim(),
        jobType: data.jobType,
        jobLink: data.jobLink || null,
        checkOnly: !!data.checkOnly,
        imageIds: uploadedImageIds,
        postedById: userId.id,
        postedByName: userId.name,
        publish: true,
      };

      createDocumentWithToast(jobData, conf.appWriteCollectionIdJobs, navigate);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero / Header */}
      <div
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#fff6f5] to-white"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl ring-1 ring-[var(--accent,#CD4A3D)]/20"
                style={{
                  background: "rgba(205,74,61,.08)",
                  ["--accent"]: ACCENT,
                }}
              >
                <BriefcaseBusiness className="h-5 w-5 text-[var(--accent,#CD4A3D)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Create Job Listing
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Post roles to the Nepali community in NYC.
                </p>
              </div>
            </div>

            <div
              className="rounded-xl px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(205,74,61,.1)",
                color: ACCENT,
                border: "1px solid rgba(205,74,61,.2)",
              }}
            >
              Jobs
            </div>
          </div>

          {/* Helper strip */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Building2 className="h-4 w-4" /> Company
              </div>
              Use a clear role title and a short, scannable description.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <DollarSign className="h-4 w-4" /> Pay
              </div>
              Add salary + type (hourly, monthly, yearly) for more trust.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4" /> Contact
              </div>
              Provide phone or email—at least one is required.
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="border-t border-gray-100 bg-white/70 px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basics */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title" required>
                  Job Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Barista / Retail Associate"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: { value: 100, message: "Max 100 characters" },
                    minLength: { value: 3, message: "At least 3 characters" },
                  })}
                  error={!!errors.title}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" required>
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe responsibilities, shifts, requirements, perks…"
                  {...register("description", {
                    required: "Description is required",
                    maxLength: { value: 500, message: "Max 500 characters" },
                    minLength: { value: 10, message: "At least 10 characters" },
                  })}
                  error={!!errors.description}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </section>

            {/* Pay & Location */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="salary" required>
                  Salary
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 18.50"
                    {...register("salary", {
                      required: "Salary is required",
                      min: { value: 0, message: "Salary cannot be negative" },
                    })}
                    error={!!errors.salary}
                    className="w-2/3"
                  />
                  <Select
                    id="salaryType"
                    {...register("salaryType")}
                    className="w-1/3"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </Select>
                </div>
                <FieldError message={errors.salary?.message} />
              </div>

              <div>
                <Label htmlFor="location" required>
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="Neighborhood / City"
                    className="pl-9"
                    {...register("location", {
                      required: "Location is required",
                      maxLength: { value: 200, message: "Max 200 characters" },
                    })}
                    error={!!errors.location}
                  />
                </div>
                <FieldError message={errors.location?.message} />
              </div>
            </section>

            {/* Contact & type */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="+1 212 555 1234"
                    className="pl-9"
                    {...register("contactNumber", {
                      pattern: {
                        value: /^[0-9+\-\s]+$/,
                        message: "Invalid contact number",
                      },
                    })}
                    error={!!errors.contactNumber}
                  />
                </div>
                <FieldError message={errors.contactNumber?.message} />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="hr@company.com"
                    className="pl-9"
                    {...register("contactEmail", {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    error={!!errors.contactEmail}
                  />
                </div>
                <FieldError message={errors.contactEmail?.message} />
              </div>

              {!contactNumber && !contactEmail && (
                <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  ⚠️ Please provide at least a contact number or an email.
                </div>
              )}

              <div>
                <Label htmlFor="jobType" required>
                  Job Type
                </Label>
                <Select
                  id="jobType"
                  {...register("jobType", { required: "Job type is required" })}
                  error={!!errors.jobType}
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="temporary">Temporary</option>
                </Select>
                <FieldError message={errors.jobType?.message} />
              </div>

              <div>
                <Label htmlFor="company" required>
                  Company
                </Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Company name"
                    className="pl-9"
                    {...register("company", {
                      required: "Company is required",
                      maxLength: { value: 100, message: "Max 100 characters" },
                    })}
                    error={!!errors.company}
                  />
                </div>
                <FieldError message={errors.company?.message} />
              </div>
            </section>

            {/* Link */}
            <section className="grid gap-6">
              <div>
                <Label htmlFor="jobLink">Job Application Link (optional)</Label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="jobLink"
                    type="url"
                    placeholder="https://apply-link.com"
                    className="pl-9"
                    {...register("jobLink", {
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                        message: "Please enter a valid URL",
                      },
                    })}
                    error={!!errors.jobLink}
                  />
                </div>
                <FieldError message={errors.jobLink?.message} />
              </div>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Company / Role Images
                </h3>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                Add a logo or workplace photo. First image becomes the cover.
              </p>
              <ImageUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </section>

            {/* Remote Only */}
            <div className="flex items-center gap-2">
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
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent,#CD4A3D)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto disabled:bg-gray-400"
                style={{ ["--accent"]: ACCENT }}
                disabled={isSubmitting || !userId?.id}
              >
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modals */}
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
