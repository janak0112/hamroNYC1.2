// components/CategoryTiles.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Home, ShoppingCart, Calendar } from "lucide-react";

const categories = [
  {
    name: "Rooms",
    description: "Find a room to rent or sublet.",
    icon: <Home size={24} />,
    link: "/rooms",
  },
  {
    name: "Jobs",
    description: "Explore job opportunities in New York.",
    icon: <Briefcase size={24} />,
    link: "/jobs",
  },
  {
    name: "Market",
    description: "Buy and sell items in your area.",
    icon: <ShoppingCart size={24} />,
    link: "/market",
  },
  {
    name: "Events",
    description: "Stay updated with local events.",
    icon: <Calendar size={24} />,
    link: "/events",
  },
];

const CategoryTiles = () => (
  <div className="container mx-auto p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all"
        >
          <Link to={category.link} className="block p-6 text-center">
            <div className="mb-4 text-blue-500">{category.icon}</div>
            <h3 className="text-xl font-semibold">{category.name}</h3>
            <p className="mt-2 text-gray-500">{category.description}</p>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryTiles;
