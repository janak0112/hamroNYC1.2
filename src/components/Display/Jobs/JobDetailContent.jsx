import React from "react";
import {
  Phone,
  MapPin,
  CalendarClock,
  Mail,
  Building2,
  Share2,
  BriefcaseBusiness,
  Globe2,
  ArrowUpRight,
} from "lucide-react";

const ACCENT = "#CD4A3D";

function JobDetailContent({ job, imageUrl }) {
  const fmtName = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "";

  const salaryNumber =
    typeof job.salary === "number" ? job.salary : Number(job.salary ?? NaN);
  const salaryLabel =
    Number.isFinite(salaryNumber) && salaryNumber >= 0
      ? `${new Intl.NumberFormat(undefined, {
          maximumFractionDigits: 2,
        }).format(salaryNumber)} / ${job.salaryType || "hourly"}`
      : "Not specified";

  const dateLabel = job.$createdAt
    ? new Date(job.$createdAt).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const company = job.company || "Company not listed";
  const isRemote = !!job.checkOnly; // your field for remote-only
  const jobType =
    (job.jobType || "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "Job";

  const share = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: job.title,
          text: `Job: ${job.title} at ${company}`,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        });
      }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      {imageUrl && (
        <div
          className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          <div className="aspect-[16/7] w-full overflow-hidden bg-gray-50">
            <img
              src={imageUrl}
              onError={(e) => (e.currentTarget.style.display = "none")}
              alt={job.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start justify-between gap-4 px-6 pb-6 pt-5 sm:flex-row sm:items-end sm:px-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {job.title}
              </h1>
              <p className="mt-0.5 text-sm text-gray-600">{company}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
                  <BriefcaseBusiness size={14} className="mr-1" />
                  {jobType}
                </span>
                {isRemote ? (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 ring-1 ring-blue-200">
                    <Globe2 size={14} className="mr-1" />
                    Remote
                  </span>
                ) : null}
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
                  <MapPin size={14} className="mr-1" />
                  {job.location || "Unknown location"}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
                  <CalendarClock size={14} className="mr-1" />
                  Posted {dateLabel}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                title="Share"
              >
                <Share2 size={16} />
                Share
              </button>
              {job.jobLink && (
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ ["--accent"]: ACCENT }}
                >
                  Apply <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Compensation
              </h3>
              <p
                className={`text-xl font-bold ${
                  salaryLabel === "Not specified"
                    ? "text-gray-600"
                    : "text-green-600"
                }`}
              >
                ${salaryLabel}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Company
              </h3>
              <p className="flex items-center text-gray-800">
                <Building2 size={18} className="mr-2 text-gray-600" />
                <span className="font-medium">{company}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Job Description
            </h3>
            <p className="whitespace-pre-line text-[15px] leading-7 text-gray-700">
              {job.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* RIGHT: sticky card */}
        <aside
          className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6"
          style={{
            boxShadow:
              "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
          }}
        >
          {/* Salary */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Salary</h3>
            <p
              className={`mt-1 text-2xl font-bold ${
                salaryLabel === "Not specified"
                  ? "text-gray-600"
                  : "text-green-600"
              }`}
            >
              ${salaryLabel}
            </p>
          </div>

          {/* Contact */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            {job.contactNumber ? (
              <p className="flex items-center text-sm text-gray-800">
                <Phone size={16} className="mr-2 text-gray-600" />
                {job.contactNumber}
              </p>
            ) : null}
            {job.contactEmail ? (
              <p className="flex items-center text-sm text-gray-800">
                <Mail size={16} className="mr-2 text-gray-600" />
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-blue-600 underline-offset-2 hover:underline"
                >
                  {job.contactEmail}
                </a>
              </p>
            ) : null}
          </div>

          {/* Posted by */}
          {job.postedByName && (
            <p className="mt-4 text-xs text-gray-500">
              Posted by{" "}
              <span className="font-medium text-gray-800">
                {job.postedByName}
              </span>
            </p>
          )}

          {/* CTA */}
          <div className="mt-6">
            {job.jobLink ? (
              <a
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
                style={{ ["--accent"]: ACCENT }}
              >
                Apply on Company Site
              </a>
            ) : (
              <button
                disabled
                className="block w-full cursor-not-allowed rounded-xl bg-gray-300 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                No Application Link Provided
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default JobDetailContent;
