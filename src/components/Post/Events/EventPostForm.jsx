import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { uploadImages } from "../../../utils/uploadFile";
import conf from "../../../conf/conf";
import { checkUserLoggedIn } from "../../../utils/authUtils";
import { createDocumentWithToast } from "../../../utils/documentUtils";
import ImageUploader from "../../ImageUploader/ImageUploader";
import {
  CalendarDays,
  Clock,
  MapPin,
  Link2,
  Ticket,
  Globe2,
  Building2,
} from "lucide-react";
import DateField from "../../DateField/DateField";

const ACCENT = "#CD4A3D";

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
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition
      placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10
      ${error ? "border-red-300 focus:ring-red-100" : "border-gray-200"}
      ${className}`}
  />
);

const Textarea = ({ error, className = "", ...rest }) => (
  <textarea
    {...rest}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition
      placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10
      ${error ? "border-red-300 focus:ring-red-100" : "border-gray-200"}
      ${className}`}
    rows={5}
  />
);

const Select = ({ error, className = "", children, ...rest }) => (
  <select
    {...rest}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition
      focus:ring-2 focus:ring-gray-900/10
      ${error ? "border-red-300 focus:ring-red-100" : "border-gray-200"}
      ${className}`}
  >
    {children}
  </select>
);

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

const EventPostForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    control
  } = useForm();

  const [postedBy, setUser] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

  const ticketOption = watch("ticketOption");
  const eventMode = watch("eventMode");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const verifyUser = async () => {
      const user = await checkUserLoggedIn({ navigate });
      if (user) setUser({ id: user.$id, name: user.name });
    };
    verifyUser();
  }, [navigate]);

  // Reset conditional fields when toggles change
  useEffect(() => {
    if (eventMode !== "inPerson") setValue("location", "");
    if (eventMode !== "online") setValue("onlineLink", "");
  }, [eventMode, setValue]);

  useEffect(() => {
    if (ticketOption !== "paid") setValue("ticketCost", "");
  }, [ticketOption, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let uploadedImageIds = [];
      if (selectedFiles.length > 0) {
        uploadedImageIds = await uploadImages(selectedFiles);
      }

      const eventData = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        location: data.eventMode === "inPerson" ? data.location?.trim() : null,
        contact: data.contact?.trim(),
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        ticketOption: data.ticketOption,
        ticketCost:
          data.ticketOption === "paid" ? String(parseFloat(data.ticketCost)) : null,
        ticketLink: data.ticketLink || null,
        eventMode: data.eventMode,
        onlineLink: data.eventMode === "online" ? data.onlineLink : null,
        imageIds: uploadedImageIds,
        postedBy: JSON.stringify(postedBy).slice(0, 999),
      };

      createDocumentWithToast(
        eventData,
        conf.appWriteCollectionIdEvents,
        navigate
      );
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
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Create Event Listing
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Share your community event—online or in-person.
              </p>
            </div>
            <div
              className="rounded-xl px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(205,74,61,.1)",
                color: ACCENT,
                border: "1px solid rgba(205,74,61,.2)",
              }}
            >
              Events
            </div>
          </div>

          {/* Helper strip */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <CalendarDays className="h-4 w-4" /> Date & Time
              </div>
              Pick a future date and add the start time.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Ticket className="h-4 w-4" /> Tickets
              </div>
              Mark it free or paid, and add a link if needed.
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Globe2 className="h-4 w-4" /> Mode
              </div>
              Online events need a meeting link; in-person needs a location.
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white/70 px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic info */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title" required>
                  Event Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Dashain Cultural Night"
                  {...register("title", {
                    required: "Event title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
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
                  placeholder="Describe the event agenda, performers, dress code, etc."
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                  error={!!errors.description}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </section>

            {/* Mode & location/link */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="eventMode" required>
                  Event Mode
                </Label>
                <Select
                  id="eventMode"
                  {...register("eventMode", {
                    required: "Please select event mode",
                  })}
                  error={!!errors.eventMode}
                >
                  <option value="">-- Select Mode --</option>
                  <option value="inPerson">In-Person</option>
                  <option value="online">Online</option>
                </Select>
                <FieldError message={errors.eventMode?.message} />
              </div>

              {eventMode === "inPerson" && (
                <div>
                  <Label htmlFor="location" required>
                    Event Location
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="Venue name, street, city"
                      className="pl-9"
                      {...register("location", {
                        required: "Location is required",
                      })}
                      error={!!errors.location}
                    />
                  </div>
                  <FieldError message={errors.location?.message} />
                </div>
              )}

              {eventMode === "online" && (
                <div className="md:col-span-1">
                  <Label htmlFor="onlineLink" required>
                    Online Meeting Link
                  </Label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="onlineLink"
                      type="url"
                      placeholder="https://zoom.us/..."
                      className="pl-9"
                      {...register("onlineLink", {
                        required: "Online link is required for online events",
                        pattern: {
                          value:
                            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                          message: "Please enter a valid URL",
                        },
                      })}
                      error={!!errors.onlineLink}
                    />
                  </div>
                  <FieldError message={errors.onlineLink?.message} />
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="contact" required>
                  Contact Info
                </Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="Name / email / phone"
                  {...register("contact", {
                    required: "Contact info is required",
                  })}
                  error={!!errors.contact}
                />
                <FieldError message={errors.contact?.message} />
              </div>
            </section>

            {/* Date & time */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="eventDate" required>
                  Event Date
                </Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  {/* <Input
                    id="eventDate"
                    type="date"
                    min={today}
                    className="pl-9"
                    {...register("eventDate", {
                      required: "Event date is required",
                    })}
                    error={!!errors.eventDate}
                  /> */}

                  <Controller
                    name="eventDate"
                    control={control}
                    rules={{ required: "Event date is required" }}
                    render={({ field, fieldState }) => (
                      <>
                        <DateField
                          id="eventDate"
                          value={field.value}
                          onChange={field.onChange}
                          minDate={new Date()}            // same idea as your previous "today"
                          placeholder="Select date"
                          error={!!fieldState.error}
                        />
                        <FieldError message={fieldState.error?.message} />
                      </>
                    )}
                  />
                </div>
                {/* <FieldError message={errors.eventDate?.message} /> */}
              </div>

              <div>
                <Label htmlFor="eventTime" required>
                  Event Time
                </Label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="eventTime"
                    type="time"
                    className="pl-9"
                    {...register("eventTime", {
                      required: "Event time is required",
                    })}
                    error={!!errors.eventTime}
                  />
                </div>
                <FieldError message={errors.eventTime?.message} />
              </div>
            </section>

            {/* Tickets */}
            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="ticketOption" required>
                  Ticket Option
                </Label>
                <Select
                  id="ticketOption"
                  {...register("ticketOption", {
                    required: "Please select an option",
                  })}
                  error={!!errors.ticketOption}
                >
                  <option value="">-- Select --</option>
                  <option value="free">Free Entry</option>
                  <option value="paid">Paid Ticket</option>
                </Select>
                <FieldError message={errors.ticketOption?.message} />
              </div>

              {ticketOption === "paid" && (
                <div>
                  <Label htmlFor="ticketCost" required>
                    Ticket Cost ($)
                  </Label>
                  <Input
                    id="ticketCost"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 15.00"
                    {...register("ticketCost", {
                      required: "Ticket cost is required for paid events",
                      min: { value: 0, message: "Cost cannot be negative" },
                    })}
                    error={!!errors.ticketCost}
                  />
                  <FieldError message={errors.ticketCost?.message} />
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="ticketLink">
                  Ticket / Registration Link (optional)
                </Label>
                <Input
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
                  error={!!errors.ticketLink}
                />
                <FieldError message={errors.ticketLink?.message} />
              </div>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Event Images
                </h3>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                Add a poster or venue photo. First image becomes the cover.
              </p>
              <ImageUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </section>

            {/* Submit */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent,#CD4A3D)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                style={{ ["--accent"]: ACCENT }}
              >
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventPostForm;
