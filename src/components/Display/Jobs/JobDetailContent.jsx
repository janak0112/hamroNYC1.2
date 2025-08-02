// components/JobDetailContent.jsx
import React from "react";
import { Phone, MapPin, CalendarClock, Mail } from "lucide-react";

function JobDetailContent({ job, imageUrl }) {
  const formatName = (name) =>
    name
      ? name
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "";

  return (
    <div className="container mx-auto px-6 py-20 content-wrapper">
      {/* Hero Image */}
      {imageUrl && (
        <div className="w-full mb-8">
          <img
            src={imageUrl}
            alt={job.title}
            className="w-full max-h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Job Title & Company */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        {job.title}
      </h1>
      <h2 className="text-xl text-gray-600 font-medium">
        {job.company || "Company not listed"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Location & Posted Date */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="font-medium">
                {job.location || "Unknown location"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock size={18} />
              <span>
                Posted on:{" "}
                {new Date(job.$createdAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {job.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Right Column (Contact Card) */}
        <div className="bg-white shadow-xl border rounded-xl p-6 sticky top-6 h-fit">
          {/* Salary */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Salary</h3>
            <p className="text-3xl font-bold text-green-600">
              {job.salary
                ? `${job.salary} / ${job.salaryType}`
                : "Not specified"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Contact Information
            </h3>
            {job.contactNumber && (
              <div className="flex items-center space-x-2 mt-2 text-gray-700">
                <Phone size={18} />
                <span>{job.contactNumber}</span>
              </div>
            )}
            {job.contactEmail && (
              <div className="flex items-center space-x-2 mt-2 text-gray-700">
                <Mail size={18} />
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {job.contactEmail}
                </a>
              </div>
            )}
          </div>

          {/* Posted By */}
          <p className="text-sm text-gray-500 mb-6">
            Posted by:{" "}
            <span className="font-medium text-gray-800">
              {formatName(JSON.parse(job.postedBy).name)}
            </span>
          </p>

          {/* Apply Button */}
          {job.jobLink ? (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-center text-white font-semibold rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 shadow-md block transition"
            >
              Apply on Company Site
            </a>
          ) : (
            <button
              className="w-full py-3 text-center text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-md block transition"
              disabled
            >
              No Application Link Provided
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailContent;
