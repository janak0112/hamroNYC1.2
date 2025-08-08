import React, { useState, useEffect } from "react";
import listingService from "../../../appwrite/config";
import conf from "../../../conf/conf";
import { useNavigate } from "react-router-dom";
import authService from "../../../appwrite/auth";

const PostLookingForm = ({ onSubmit }) => {
  const [success, setSuccess] = useState(false); // ✅ Success state
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
    postedBy: {},
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authService.getCurrentUser();

        if (!user) {
          navigate(`/login?redirect=/add-your-flight`);
          return;
        }

        setForm((prev) => ({
          ...prev,
          postedBy: JSON.stringify({ id: user.$id, name: user.name }),
        }));
      } catch (err) {
        console.error("Error getting user:", err);
        navigate("/login"); // fallback redirect
      }
    };
    getUser();
  }, [navigate]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await listingService.createDocument(
        form,
        conf.appWriteCollectionIdTravelC
      );

      setTimeout(() => {
        navigate("/travel"); // ✅ Redirect after delay
      }, 2000); // 2-second delay to show message
    } catch (error) {
      console.error("Error adding flight:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl px-8 py-10 max-w-2xl mx-auto space-y-6 mt-10 mb-16"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
        <span className="text-[#2563eb] mr-2">👀</span>
        Post You're <span className="text-[#2563eb]">Looking</span> For a Flight
      </h2>
      {/* ✅ Show success message */}
      {success && (
        <p className="text-green-600 text-center mt-4 font-medium">
          🎉 Flight added successfully! Redirecting...
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 font-medium text-sm">From</label>
          <input
            name="fromLocation"
            type="text"
            required
            value={form.fromLocation}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="JFK"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">To</label>
          <input
            name="toLocation"
            type="text"
            required
            value={form.toLocation}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Kathmandu"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">
            Preferred Start Date
          </label>
          <input
            name="preferredStartDate"
            type="date"
            required
            value={form.preferredStartDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">
            Preferred End Date
          </label>
          <input
            name="preferredEndDate"
            type="date"
            required
            value={form.preferredEndDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">
            Tentative Month
          </label>
          <select
            name="tentativeMonth"
            required
            value={form.tentativeMonth}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">Select a month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Contact</label>
          <input
            name="contact"
            type="text"
            required
            value={form.contact}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="+1 555 555 5555"
            onBlur={() => {
              const digits = form.contact.replace(/\D/g, "");
              if (digits.length < 10) {
                alert(
                  "Please enter a valid phone number with at least 10 digits."
                );
              }
            }}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm">
          Description (optional)
        </label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
          placeholder="Baggage needs, companion request, etc."
        />
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          className="border border-[#2463EB] text-[#2463EB] font-semibold py-2 px-6 rounded-full hover:bg-[#2463EB] hover:text-white transition"
        >
          👀 Submit Request
        </button>
      </div>
    </form>
  );
};

export default PostLookingForm;
