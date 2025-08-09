import React from "react";
import { useNavigate } from "react-router-dom";
import {
  House,
  BriefcaseBusiness,
  ShoppingCart,
  CalendarDays,
  Plane,
  ArrowRight,
} from "lucide-react";

const ACCENT = "#CD4A3D";

const postTypes = [
  {
    key: "room",
    label: "Room",
    description: "Post a room listing",
    icon: House,
    path: "/add-room",
  },
  {
    key: "job",
    label: "Job",
    description: "Post a job listing",
    icon: BriefcaseBusiness,
    path: "/add-job",
  },
  {
    key: "market",
    label: "Market",
    description: "Post an item for sale",
    icon: ShoppingCart,
    path: "/add-market",
  },
  {
    key: "event",
    label: "Event",
    description: "Post an event",
    icon: CalendarDays,
    path: "/add-event",
  },
  {
    key: "travel",
    label: "Travel Companions",
    description: "Post travel companions",
    icon: Plane,
    path: "/travel",
    badge: "New",
  },
];

const AddPostPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Choose a Category to Add a Post
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {postTypes.map(
          ({ key, label, description, icon: Icon, path, badge }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="group relative flex w-full flex-col items-start rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
            >
              {badge && (
                <span
                  className="absolute right-4 top-4 rounded-full bg-[var(--accent,#CD4A3D)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent,#CD4A3D)] ring-1 ring-[var(--accent,#CD4A3D)]/20"
                  style={{ ["--accent"]: ACCENT }}
                >
                  {badge}
                </span>
              )}

              <div
                className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-[var(--accent,#CD4A3D)]/10 ring-1 ring-[var(--accent,#CD4A3D)]/20"
                style={{ ["--accent"]: ACCENT }}
              >
                <Icon className="h-7 w-7 text-[var(--accent,#CD4A3D)]" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
              <p className="mt-1 text-sm text-gray-600">{description}</p>

              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                Select
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AddPostPage;
