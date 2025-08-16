import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import conf from "../../../conf/conf";

const ACCENT = "#EC3922";
const todayStr = () => new Date().toISOString().split("T")[0];

const AddFlightForm = () => {
  const [form, setForm] = useState({
    fromLocation: "",
    toLocation: "",
    flightNo: "",
    contact: "+1",
    date: "",
    returnDate: "",
    description: "",
    transitAirport: "",
    airlines: "",
    postType: "offering", // offering | looking
    postedById: "",
    postedByName: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Require login & set postedBy
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        console.log(user);
        if (!user) {
          navigate(`/login?redirect=/add-your-flight`);
          return;
        }
        setForm((prev) => ({
          ...prev,
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
    // clear field error on change
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fromLocation.trim()) e.fromLocation = "Required";
    if (!form.toLocation.trim()) e.toLocation = "Required";
    if (!form.flightNo.trim()) e.flightNo = "Required";
    if (!form.date) e.date = "Required";
    if (!form.airlines.trim()) e.airlines = "Required";
    // basic phone check
    const digits = (form.contact || "").replace(/\D/g, "");
    if (!form.contact.trim() || digits.length < 10)
      e.contact = "Enter a valid phone (10+ digits)";
    // return date must be >= date if present
    if (form.returnDate && form.date && form.returnDate < form.date) {
      e.returnDate = "Return date cannot be before departure date";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Clean payload
    const dataToSubmit = {
      ...form,
      ...(form.returnDate ? {} : { returnDate: undefined }),
      ...(form.transitAirport ? {} : { transitAirport: undefined }),
    };

    try {
      setSubmitting(true);
      await listingService.createDocument(
        dataToSubmit,
        conf.appWriteCollectionIdTravelC
      );
      toast.success("✅ Flight submitted successfully!");
      setTimeout(() => navigate("/travel"), 800);
    } catch (error) {
      console.error("Error adding flight:", error);
      toast.error("❌ Failed to submit flight. Please try again.");
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
          <span className="mr-2">✈️</span> Add Your Flight
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Share your itinerary to find/offer travel companionship.
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
            <label className={labelBase}>Flight No</label>
            <input
              name="flightNo"
              value={form.flightNo}
              onChange={handleChange}
              placeholder="QR 645"
              className={`${inputBase} ${
                errors.flightNo ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            />
            {errors.flightNo && <FieldError>{errors.flightNo}</FieldError>}
          </div>

          <div>
            <label className={labelBase}>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={todayStr()}
              className={`${inputBase} ${
                errors.date ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            />
            {errors.date && <FieldError>{errors.date}</FieldError>}
          </div>

          <div>
            <label className={labelBase}>Return Date (optional)</label>
            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              min={form.date || todayStr()}
              className={`${inputBase} ${
                errors.returnDate ? "border-red-300 focus:ring-red-100" : ""
              }`}
            />
            {errors.returnDate && <FieldError>{errors.returnDate}</FieldError>}
          </div>

          <div>
            <label className={labelBase}>Transit Airport (optional)</label>
            <input
              name="transitAirport"
              value={form.transitAirport}
              onChange={handleChange}
              placeholder="Doha"
              className={inputBase}
            />
          </div>

          <div>
            <label className={labelBase}>Airlines</label>
            <input
              name="airlines"
              value={form.airlines}
              onChange={handleChange}
              placeholder="Qatar Airways"
              className={`${inputBase} ${
                errors.airlines ? "border-red-300 focus:ring-red-100" : ""
              }`}
              required
            />
            {errors.airlines && <FieldError>{errors.airlines}</FieldError>}
          </div>

          <div>
            <label className={labelBase}>Contact</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="+1 555 555 5555"
              className={`${inputBase} ${
                errors.contact ? "border-red-300 focus:ring-red-100" : ""
              }`}
              inputMode="tel"
              required
            />
            {errors.contact && <FieldError>{errors.contact}</FieldError>}
          </div>
        </div>

        <div className="mt-4">
          <label className={labelBase}>Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Extra baggage? Travel buddy? Any note here."
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
            {submitting ? "Submitting…" : "✈️ Submit Flight"}
          </button>
        </div>
      </div>
    </form>
  );
};

const FieldError = ({ children }) => (
  <p className="mt-1 text-xs text-red-600">{children}</p>
);

export default AddFlightForm;
