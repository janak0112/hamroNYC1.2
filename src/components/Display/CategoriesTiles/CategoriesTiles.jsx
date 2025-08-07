import React, { useState, useCallback, useContext } from "react";
import { MapPin, Calendar, Clock, DollarSign, Briefcase } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ImgApt from "../../../assets/img/noimage.png";
import { getImageUrls } from "../../../utils/uploadFile";
import { DataContext } from "../../../context/DataContext";

export default function ListingList() {
  const { type } = useParams();
  const { jobs, market, events, rooms, loading, error } =
    useContext(DataContext);
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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Discover All{" "}
          <span className="text-[rgba(212,17,56,1)] capitalize">{type}</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Find the best {type} listings updated daily
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
        {listings.map((item) => {
          const active = activeImages[item.$id] || 0;
          const images = item.imageIds?.length
            ? getImageUrls(item.imageIds)
            : [ImgApt];

          return (
            <div
              key={item.$id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100">
                <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={images[active]}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = ImgApt;
                    }}
                  />
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => changeSlide(item.$id, i)}
                      className={`h-10 aspect-video rounded-lg overflow-hidden transition ${
                        i === active
                          ? "ring-2 ring-[rgba(212,17,56,1)]"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = ImgApt)}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="px-4 pt-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                {item.location && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {item.location}
                  </p>
                )}
              </div>

              <div className="px-4 mt-3 text-sm text-gray-700 space-y-2">
                <ul className="divide-y divide-gray-100">
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

              <div className="px-4 py-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description || "No description available."}
                </p>
              </div>

              <div className="px-4 pb-4 mt-auto ">
                <Link
                  to={`/${type}/${item.$id}`}
                  className="inline-block text-sm text-[rgba(212,17,56,1)] font-semibold border border-[rgba(212,17,56,1)] rounded-full px-4 py-2 hover:bg-[rgba(212,17,56,1)] hover:text-white transition-all duration-300"
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
