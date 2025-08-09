import React, { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Phone,
  IdCard,
  Calendar,
  User2,
  Shield,
  Edit3,
  Trash2,
} from "lucide-react";
import authService from "../../appwrite/auth";
import listingService from "../../appwrite/config";
import conf from "../../conf/conf";

const accent = "#CD4A3D";

const Badge = ({ ok, yes = "Verified", no = "Not verified" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
      ok
        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
        : "bg-red-50 text-red-700 ring-1 ring-red-200"
    }`}
  >
    {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
    {ok ? yes : no}
  </span>
);

const Stat = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="rounded-xl bg-gray-50 p-3">
      <Icon className="h-5 w-5 text-gray-700" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-4 border-b pb-3 text-lg font-semibold text-gray-800">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="mt-[2px] rounded-lg bg-gray-50 p-2">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-0.5 text-[15px] font-medium text-gray-900">
        {children}
      </div>
    </div>
  </div>
);

const Skeleton = () => (
  <div className="mx-auto mt-10 max-w-3xl animate-pulse space-y-4">
    <div className="h-40 rounded-2xl bg-gray-100" />
    <div className="grid grid-cols-3 gap-4">
      <div className="h-20 rounded-2xl bg-gray-100" />
      <div className="h-20 rounded-2xl bg-gray-100" />
      <div className="h-20 rounded-2xl bg-gray-100" />
    </div>
    <div className="h-56 rounded-2xl bg-gray-100" />
  </div>
);

const avatarBgFromName = (name = "") => {
  const hues = [12, 18, 4, 10, 0, 6, 14]; // warm-ish hues
  const idx = (name.charCodeAt(0) || 65) % hues.length;
  return `hsl(${hues[idx]} 80% 92%)`;
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

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
          let totalPosts = 0;
          const collections = [
            conf.appWriteCollectionIdRooms,
            conf.appWriteCollectionIdJobs,
            conf.appWriteCollectionIdMarket,
            conf.appWriteCollectionIdEvents,
          ];
          // Count posts across all collections
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

  if (loading) return <Skeleton />;
  if (!user)
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="mb-4 text-lg font-semibold text-gray-900">
          No user logged in
        </p>
        <p className="mb-6 text-sm text-gray-600">
          Please sign in to view your profile.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Go to Login
        </a>
      </div>
    );

  const isStudent = user.email?.endsWith(".edu");
  const phoneAdded = Boolean(user.phone);
  const phoneVerified = Boolean(user.phoneVerification);

  return (
    <div className="mx-auto mb-24 mt-8 max-w-5xl px-4">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#fff6f5] to-white shadow-sm"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        <div className="flex flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold"
              style={{ background: avatarBgFromName(user.name), color: accent }}
            >
              {initials(user.name) || <User2 className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your account and listings
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              onClick={() => {}}
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              onClick={() => {}}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 border-t border-gray-100 bg-white/60 p-6 sm:grid-cols-3">
          <Stat
            label="Status"
            value={user.status ? "Active" : "Inactive"}
            icon={Shield}
          />
          <Stat label="Number of Posts" value={postCount} icon={IdCard} />
          <Stat
            label="Joined On"
            value={new Date(user.registration).toLocaleDateString()}
            icon={Calendar}
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Section title="Basic Information">
          <Row icon={User2} label="Name">
            {user.name
              ? user.name
                  .split(" ")
                  .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
                  .join(" ")
              : "Not set"}
          </Row>
          <Row icon={Mail} label="Email">
            <div className="flex flex-wrap items-center gap-2">
              <span>{user.email}</span>
              <Badge
                ok={!!user.emailVerification}
                yes="Email verified"
                no="Email not verified"
              />
            </div>
          </Row>
          <Row icon={IdCard} label="User ID">
            <code className="rounded-md bg-gray-50 px-2 py-1 text-[13px] text-gray-700">
              {user.$id}
            </code>
          </Row>
        </Section>

        <Section title="Contact Information">
          <Row icon={Phone} label="Phone Number">
            {phoneAdded ? user.phone : "Not added"}
          </Row>
          <Row icon={Shield} label="Phone Status">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                ok={phoneVerified}
                yes="Phone verified"
                no="Not verified"
              />
              {!phoneVerified && (
                <a
                  href="/verify-phone"
                  className="ml-1 inline-flex items-center rounded-lg border border-transparent bg-[var(--accent,#CD4A3D)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                  style={{ ["--accent"]: accent }}
                >
                  Verify now
                </a>
              )}
            </div>
          </Row>

          {!phoneVerified && (
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              ⚠️ You must verify your phone number to post a listing. Your
              number will <strong>not</strong> be visible to other users.
            </div>
          )}
        </Section>

        <Section title="Account Details">
          <Row icon={Calendar} label="Member Since">
            {new Date(user.registration).toLocaleDateString()}
          </Row>
          <Row icon={Shield} label="Account Status">
            <Badge ok={!!user.status} yes="Active" no="Inactive" />
          </Row>
          <Row icon={IdCard} label="Student Status">
            {user.email?.endsWith(".edu") ? (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                Student (.edu email)
              </span>
            ) : (
              <span className="text-gray-700">Not a student</span>
            )}
          </Row>
        </Section>

        <Section title="Your Activity">
          <Row icon={IdCard} label="Total Posts">
            {postCount}
          </Row>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
            Tip: Verified phone numbers help your listings surface more and
            build trust with renters/employers.
          </div>
        </Section>
      </div>
    </div>
  );
};

export default MyProfile;
