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
    <div className="px-4 sm:px-6 lg:px-12 py-20 max-w-7xl mx-auto">
      {/* Hero Image */}
      <div className="w-full mb-10">
        <img
          src={imageUrl}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          alt={job.title}
          className="w-full h-auto max-h-[280px] object-contain mx-auto rounded-lg shadow-md bg-gray-100"
        />
      </div>

      {/* Title & Company */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight leading-tight">
        {job.title}
      </h1>
      <h2 className="text-lg font-medium text-gray-500 mb-6">
        {job.company || "Company not listed"}
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4">
        {/* LEFT: Job Details */}
        <div className="col-span-2 space-y-8">
          {/* Location + Posted Date */}
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              {job.location || "Unknown location"}
            </span>
            <span className="flex items-center gap-1">
              <CalendarClock size={16} />
              Posted on:{" "}
              {new Date(job.$createdAt).toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* RIGHT: Info Card */}
        <div className="bg-white shadow-md border border-gray-100 rounded-xl p-6 space-y-6 sticky top-6 h-fit">
          {/* Salary */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Salary</h3>
            <p className="text-2xl font-bold text-green-600">
              {job.salary
                ? `${job.salary} / ${job.salaryType}`
                : "Not specified"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            {job.contactNumber && (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Phone size={16} />
                {job.contactNumber}
              </div>
            )}
            {job.contactEmail && (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Mail size={16} />
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {job.contactEmail}
                </a>
              </div>
            )}
          </div>

          {/* Posted By */}
          <p className="text-xs text-gray-400">
            Posted by{" "}
            <span className="font-medium text-gray-700">
              {formatName(JSON.parse(job.postedBy).name)}
            </span>
          </p>

          {/* CTA Button */}
          {job.jobLink ? (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-center text-white font-semibold rounded-md bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition block"
            >
              Apply on Company Site
            </a>
          ) : (
            <button
              className="w-full py-3 text-center text-white font-semibold rounded-md bg-gradient-to-r from-gray-400 to-gray-500 opacity-70 cursor-not-allowed"
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
