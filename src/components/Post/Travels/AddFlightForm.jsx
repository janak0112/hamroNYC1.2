import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import listingService from "../../../appwrite/config";
import authService from "../../../appwrite/auth";
import conf from "../../../conf/conf";

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
    postType: "offering", // or "looking" if you want toggle logic
    postedBy: {},
  });
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean data: remove empty optional fields
    const dataToSubmit = { ...form };
    if (!dataToSubmit.returnDate) delete dataToSubmit.returnDate;
    if (!dataToSubmit.transitAirport) delete dataToSubmit.transitAirport;
    try {
      // onSubmit(dataToSubmit); // Replace with your backend logic
      listingService.createDocument(form, conf.appWriteCollectionIdTravelC);
      toast.success("✅ Flight submitted successfully!");

      setTimeout(() => {
        navigate("/travel"); // ✅ Redirect after delay
      }, 1000); // 2-second delay to show message
    } catch (error) {
      console.error("Error adding flight:", error);
      toast.error("❌ Failed to submit flight. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl px-8 py-10 max-w-2xl mx-auto space-y-6 mt-10 mb-16"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
        <span className="text-[#2563eb] mr-2">✈️</span>
        Add Your <span className="text-[#2563eb]">Flight</span> Details
      </h2>

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
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Kathmandu"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Flight No</label>
          <input
            name="flightNo"
            type="text"
            required
            value={form.flightNo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="QR 645"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Date</label>
          <input
            name="date"
            type="date"
            required
            value={form.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            min={new Date().toISOString().split("T")[0]} // sets today's date as minimum
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">
            Return Date (optional)
          </label>
          <input
            name="returnDate"
            type="date"
            value={form.returnDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            min={new Date().toISOString().split("T")[0]} // sets today's date as minimum
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">
            Transit Airport (optional)
          </label>
          <input
            name="transitAirport"
            type="text"
            value={form.transitAirport}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Doha"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Airlines</label>
          <input
            name="airlines"
            type="text"
            required
            value={form.airlines}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Qatar Airways"
          />
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
        <label className="block mb-1 font-medium text-sm">Description</label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
          placeholder="Extra baggage? Travel buddy? Any note here."
        />
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          className="border border-[#2463EB] text-[#2463EB] font-semibold py-2 px-6 rounded-full hover:bg-[#2463EB] hover:text-white transition"
        >
          ✈️ Submit Flight
        </button>
      </div>
    </form>
  );
};

export default AddFlightForm;
