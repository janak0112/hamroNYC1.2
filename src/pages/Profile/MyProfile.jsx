import React, { useEffect, useState } from "react";
import authService from "../../appwrite/auth";
import listingService from "../../appwrite/config";
import conf from "../../conf/conf";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // Count posts across all collections
          let totalPosts = 0;
          const collections = [
            conf.appWriteCollectionIdRooms,
            conf.appWriteCollectionIdJobs,
            conf.appWriteCollectionIdMarket,
            conf.appWriteCollectionIdEvents,
          ];

          for (const collectionId of collections) {
            const response = await listingService.getListingsByUser(
              currentUser.$id,
              collectionId
            );
            totalPosts += response.length;
          }

          setPostCount(totalPosts);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading your profile...</p>;
  if (!user) return <p className="text-center mt-10">No user logged in.</p>;

  const isStudent = user.email.endsWith(".edu");

  // Capitalize first letter of each word in name
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
    <div className="container mx-auto max-w-3xl p-6 bg-white rounded-xl shadow-lg mt-10 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Basic Information
          </h2>
          <p>
            <strong>Name:</strong> {formatName(user.name) || "Not set"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Email Verified:</strong>{" "}
            {user.emailVerification ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-[#CD4A3D] font-semibold">No</span>
            )}
          </p>
          <p>
            <strong>User ID:</strong> {user.$id}
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Contact Information
          </h2>
          <p>
            <strong>Phone Number:</strong> {user.phone || "Not added"}
          </p>
          <p>
            <strong>Phone Verified:</strong>{" "}
            {user.phoneVerification ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-[#CD4A3D] font-semibold">No</span>
            )}
          </p>
          <p className="text-sm text-[#CD4A3D] mt-2">
            ⚠️ You must verify your phone number to post a listing. (Your number
            will <strong>not</strong> be visible to other users.)
          </p>
        </div>

        {/* Account Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Account Details
          </h2>
          <p>
            <strong>Joined On:</strong>{" "}
            {new Date(user.registration).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {user.status ? (
              <span className="text-green-600 font-semibold">Active</span>
            ) : (
              <span className="text-[#CD4A3D] font-semibold">Inactive</span>
            )}
          </p>
          <p>
            <strong>Number of Posts:</strong> {postCount}
          </p>
          <p>
            <strong>Student Status:</strong>{" "}
            {isStudent ? (
              <span className="text-blue-600 font-semibold">
                Student (.edu email)
              </span>
            ) : (
              <span className="text-gray-600">Not a student</span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t flex gap-3">
          <button className="px-4 py-2 rounded border border-[#CD4A3D] text-[#CD4A3D] font-semibold hover:bg-[#CD4A3D] hover:text-white transition">
            Edit Profile
          </button>
          <button className="px-4 py-2 rounded border border-[#CD4A3D] text-[#CD4A3D] font-semibold hover:bg-[#CD4A3D] hover:text-white transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
