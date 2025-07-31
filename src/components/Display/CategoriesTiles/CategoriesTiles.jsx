import React, { useState, useCallback, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { MapPin, Calendar, Clock, DollarSign, Briefcase } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ImgApt from "../../../assets/img/no-image.jpg";
import { getImageUrls } from "../../../utils/uploadFile";

export default function ListingList() {
  const { type } = useParams();
  const { jobs, market, events, rooms, loading, error } =
    useContext(DataContext);
  console.log("first");
  // Dynamically pick dataset from context
  const dataMap = { jobs, market, events, rooms };
  const listings = dataMap[type] || [];

  const [activeImages, setActiveImages] = useState({});
  const changeSlide = useCallback((itemId, index) => {
    setActiveImages((prev) => ({ ...prev, [itemId]: index }));
  }, []);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error)
    return <p className="text-center p-8 text-red-500">Error: {error}</p>;
  if (!listings || listings.length === 0)
    return <p className="text-center p-8">No {type} available.</p>;

  return (
    <section className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-3xl font-bold text-gray-800 mb-6 capitalize">
        All {type}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((item) => {
          const active = activeImages[item.$id] || 0;
          const images = item.imageIds?.length
            ? getImageUrls(item.imageIds)
            : [ImgApt];

          return (
            <div
              key={item.$id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Header */}
              <header className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                {item.location && (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin size={14} /> {item.location}
                  </div>
                )}
              </header>

              {/* Image Gallery */}
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[active]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                  {active + 1}/{images.length}
                </span>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => changeSlide(item.$id, i)}
                      className={`h-12 aspect-video rounded-lg overflow-hidden transition ring-offset-2 ${
                        i === active
                          ? "ring-2 ring-custom-primary"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Details Section */}
              <div className="p-4 space-y-3">
                <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                  {type === "events" && (
                    <>
                      <li className="flex justify-between py-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> Date
                        </span>
                        <span>
                          {new Date(item.eventDate).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="flex justify-between py-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> Time
                        </span>
                        <span>
                          {new Date(
                            `1970-01-01T${item.eventTime}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </li>
                    </>
                  )}

                  {type === "jobs" && (
                    <>
                      <li className="flex justify-between py-1">
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} /> Salary
                        </span>
                        <span>
                          {item.salary
                            ? `$${item.salary} / ${item.salaryType || "hourly"}`
                            : "Not specified"}
                        </span>
                      </li>
                      <li className="flex justify-between py-1">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} /> Type
                        </span>
                        <span className="capitalize">{item.jobType}</span>
                      </li>
                    </>
                  )}

                  {type === "rooms" && (
                    <li className="flex justify-between py-1">
                      <span>Available From</span>
                      <span>
                        {new Date(item.availableFrom).toLocaleDateString()}
                      </span>
                    </li>
                  )}

                  {type === "market" && (
                    <li className="flex justify-between py-1">
                      <span>Price</span>
                      <span>${item.price}</span>
                    </li>
                  )}

                  {item.contact && (
                    <li className="flex justify-between py-1">
                      <span>Contact</span>
                      <span>{item.contact}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Description */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* View More Button */}
              <div className="p-4 border-t border-gray-100">
                <Link
                  to={`/${type}/${item.$id}`}
                  className="w-full flex items-center justify-center bg-[rgba(212,17,56,1)] hover:bg-[rgba(180,15,48,1)] text-white rounded-md py-2 text-sm font-semibold transition"
                >
                  View More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
