// components/CategoryTiles.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Home,
  ShoppingCart,
  Calendar,
  Plane,
  ArrowRight,
} from "lucide-react";

const ACCENT = "#eb3822";

const categories = [
  {
    name: "Rooms",
    description: "Find a room to rent or sublet.",
    icon: Home,
    link: "/rooms",
  },
  {
    name: "Jobs",
    description: "Explore job opportunities in New York.",
    icon: Briefcase,
    link: "/jobs",
  },
  {
    name: "Market",
    description: "Buy and sell items in your area.",
    icon: ShoppingCart,
    link: "/market",
  },
  {
    name: "Events",
    description: "Stay updated with local events.",
    icon: Calendar,
    link: "/events",
  },
  {
    name: "Travel Companions",
    description: "Find travel companions to travel together.",
    icon: Plane,
    link: "/travel",
    badge: "New",
  },
];

const CategoryCard = ({ name, description, Icon, link, badge }) => (
  <Link
    to={link}
    className="group relative block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
  >
    {badge && (
      <span
        className="absolute right-3 top-3 rounded-full bg-[var(--accent,#CD4A3D)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent,#CD4A3D)] ring-1 ring-[var(--accent,#CD4A3D)]/20"
        style={{ ["--accent"]: ACCENT }}
      >
        {badge}
      </span>
    )}
    <div className="mb-3 flex items-center gap-3">
      <div
        className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent,#CD4A3D)]/10 ring-1 ring-[var(--accent,#CD4A3D)]/20"
        style={{ ["--accent"]: ACCENT }}
      >
        <Icon className="h-6 w-6 text-[var(--accent,#CD4A3D)]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
      Explore
      <ArrowRight
        size={16}
        className="transition group-hover:translate-x-0.5"
      />
    </div>
  </Link>
);

const CategoryTiles = () => (
  <section className="mx-auto max-w-6xl px-4 py-5">
    <div className="mb-6 flex items-end justify-between">
      <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((c) => (
        <CategoryCard
          key={c.name}
          name={c.name}
          description={c.description}
          Icon={c.icon}
          link={c.link}
          badge={c.badge}
        />
      ))}
    </div>
  </section>
);

export default CategoryTiles;
