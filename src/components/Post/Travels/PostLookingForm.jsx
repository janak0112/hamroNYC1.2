import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import listingService from "../../../appwrite/config";
import conf from "../../../conf/conf";
import authService from "../../../appwrite/auth";

const ACCENT = "#CD4A3D";
const todayStr = () => new Date().toISOString().split("T")[0];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PostLookingForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fromLocation: "",
    toLocation: "",
    preferredStartDate: "",
    preferredEndDate: "",
    tentativeMonth: "",
    contact: "+1",
    description: "",
    postType: "looking",
    postedById: "",
    postedByName: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // require login
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          navigate(`/login?redirect=/post-looking`);
          return;
        }
        setForm((p) => ({
          ...p,
          postedById: user.$id,
          postedByName: user.name,
        }));
      } catch (err) {
        console.error("Error getting user:", err);
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fromLocation.trim()) e.fromLocation = "Required";
    if (!form.toLocation.trim()) e.toLocation = "Required";
    if (!form.preferredStartDate) e.preferredStartDate = "Required";
    if (!form.preferredEndDate) e.preferredEndDate = "Required";
    if (
      form.preferredStartDate &&
      form.preferredEndDate &&
      form.preferredEndDate < form.preferredStartDate
    ) {
      e.preferredEndDate = "End date cannot be before start date";
    }
    if (!form.tentativeMonth) e.tentativeMonth = "Please select a month";
    const digits = (form.contact || "").replace(/\D/g, "");
    if (!form.contact.trim() || digits.length < 10)
      e.contact = "Enter a valid phone (10+ digits)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form };
    if (!payload.description) delete payload.description;

    try {
      setSubmitting(true);
      await listingService.createDocument(
        payload,
        conf.appWriteCollectionIdTravelC
      );
      setSuccess(true);
      toast.success("✅ Request posted successfully!");
      setTimeout(() => navigate("/travel"), 800);
    } catch (error) {
      console.error("Error adding request:", error);
      toast.error("❌ Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-gray-900/10";
  const labelBase = "mb-1 block text-sm font-semibold text-gray-800";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-10 max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
      style={{
        boxShadow: "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#eef3ff] to-white px-6 py-7 sm:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          <span className="mr-2">👀</span> Post You're Looking
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Share your preferred dates & route to find a companion.
        </p>
        {/* Segmented toggle */}
        <div className="mt-4 inline-grid grid-cols-2 overflow-hidden rounded-xl border border-gray-200 bg-white p-0.5">
          {["offering", "looking"].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => {
                setForm((p) => ({ ...p, postType: opt }));
                navigate(
                  opt === "offering" ? "/add-your-flight" : "/post-looking"
                );
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                form.postType === opt
                  ? "bg-[var(--accent,#2563EB)] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              style={{ ["--accent"]: ACCENT }}
            >
              {opt === "offering" ? "I’m Offering" : "I’m Looking"}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-7 sm:px-8">
        {success && (
          <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            🎉 Request added! Redirecting…
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelBase}>From</label>
            <input
              name="fromLocation"
              value={form.fromLocation}
              onChange={handleChange}
              placeholder="JFK"
              className={`${inputBase} ${
                errors.fromLocation ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            />
            {errors.fromLocation && (
              <FieldError>{errors.fromLocation}</FieldError>
            )}
          </div>

          <div>
            <label className={labelBase}>To</label>
            <input
              name="toLocation"
              value={form.toLocation}
              onChange={handleChange}
              placeholder="Kathmandu"
              className={`${inputBase} ${
                errors.toLocation ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            />
            {errors.toLocation && <FieldError>{errors.toLocation}</FieldError>}
          </div>

          <div>
            <label className={labelBase}>Preferred Start Date</label>
            <input
              type="date"
              name="preferredStartDate"
              value={form.preferredStartDate}
              onChange={handleChange}
              min={todayStr()}
              className={`${inputBase} ${
                errors.preferredStartDate
                  ? "border-red-300 focus:ring-red-100"
                  : ""
              }`}
              required
            />
            {errors.preferredStartDate && (
              <FieldError>{errors.preferredStartDate}</FieldError>
            )}
          </div>

          <div>
            <label className={labelBase}>Preferred End Date</label>
            <input
              type="date"
              name="preferredEndDate"
              value={form.preferredEndDate}
              onChange={handleChange}
              min={form.preferredStartDate || todayStr()}
              className={`${inputBase} ${
                errors.preferredEndDate
                  ? "border-red-300 focus:ring-red-100"
                  : ""
              }`}
              required
            />
            {errors.preferredEndDate && (
              <FieldError>{errors.preferredEndDate}</FieldError>
            )}
          </div>

          <div>
            <label className={labelBase}>Tentative Month</label>
            <select
              name="tentativeMonth"
              value={form.tentativeMonth}
              onChange={handleChange}
              className={`${inputBase} ${
                errors.tentativeMonth ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            >
              <option value="">Select a month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.tentativeMonth && (
              <FieldError>{errors.tentativeMonth}</FieldError>
            )}
          </div>

          <div>
            <label className={labelBase}>Contact</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="+1 555 555 5555"
              inputMode="tel"
              className={`${inputBase} ${
                errors.contact ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            />
            {errors.contact && <FieldError>{errors.contact}</FieldError>}
          </div>
        </div>

        <div className="mt-4">
          <label className={labelBase}>Description (optional)</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Baggage needs, companion request, etc."
            className={`${inputBase} min-h-[100px]`}
          />
        </div>

        <div className="pt-5 text-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full border border-[var(--accent,#2563EB)] px-6 py-2 text-sm font-semibold text-[var(--accent,#2563EB)] transition hover:bg-[var(--accent,#2563EB)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{ ["--accent"]: ACCENT }}
          >
            {submitting ? "Submitting…" : "👀 Submit Request"}
          </button>
        </div>
      </div>
    </form>
  );
};

const FieldError = ({ children }) => (
  <p className="mt-1 text-xs text-red-600">{children}</p>
);

export default PostLookingForm;
