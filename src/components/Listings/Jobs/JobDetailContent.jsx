// components/JobDetailContent.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, CalendarClock, CheckCircle } from "lucide-react";

function JobDetailContent({ job, imageUrl }) {
  console.log("IMG:" + imageUrl);
  return (
    <div className="container mx-auto p-6">
      <div>
        {imageUrl && <img src={imageUrl} alt={job.title} className="mb-4" />}
        <h1 className="text-xl font-bold">{job.title}</h1>
        {/* more job details */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <h2 className="text-xl text-gray-600">
            {job.company || "Company not listed"}
          </h2>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
            <MapPin size={16} />
            <span>{job.location || "Unknown location"}</span>
            <CalendarClock size={16} />
            <span>{new Date(job.$createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Job Description</h3>
            <p className="mt-2">
              {job.description || "No description provided."}
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Location</h3>
            <p className="mt-2">{job.location}</p>
          </div>
          {job.checkOnly && (
            <div className="mt-6 flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-lg">Check Only</span>
            </div>
          )}{" "}
          <div className="mt-6">
            <ul className="mt-4 text-gray-700 text-lg flex items-center gap-3">
              <span className="font-medium">Experience Required:</span>
              {job.experienceRequired ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <XCircle size={20} className="text-red-500" />
              )}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Salary</h3>
            <p className="text-lg font-bold">{job.salary || "Not specified"}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            {job.contact && (
              <div className="flex items-center space-x-2 mt-2">
                <Phone size={16} />
                <span>{job.contact}</span>
              </div>
            )}
            {job.email && (
              <div className="mt-2">
                <a href={`mailto:${job.email}`} className="text-blue-500">
                  {job.email}
                </a>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Posted by:{" "}
            <span className="font-medium text-gray-700">{job.userId}</span>
          </p>
          <Link
            to="/apply"
            className="w-full py-2 text-center text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 block"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobDetailContent;
