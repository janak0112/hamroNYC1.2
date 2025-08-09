// components/Header.jsx
import React, { useState, useEffect, forwardRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, X, User2, Plus, LogOut } from "lucide-react";
import authService from "../../appwrite/auth";

const ACCENT = "#CD4A3D";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Job", path: "/jobs" },
  { name: "Room", path: "/rooms" },
  { name: "Market", path: "/market" },
  { name: "Events", path: "/events" },
  { name: "Post Your Listing", path: "/post-listing", authOnly: true },
  { name: "My Posts", path: "/my-posts", authOnly: true },
];

const Header = forwardRef(function Header(_, ref) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          localStorage.setItem("userId", user.$id);
          setIsLoggedIn(true);
          setUserName(user.name || "");
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkUser();
    // close mobile menu when route changes
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      toast.success("👋 You’ve been logged out.");
      setIsLoggedIn(false);
      navigate("/");
    } catch {
      toast.error("⚠️ Logout failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const linkBase =
    "px-2 py-2 text-sm font-semibold text-gray-700 transition hover:text-gray-900";
  const linkActive =
    "text-gray-900 relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-gray-900";

  const initials =
    userName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "U";

  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/img/logo.png"
              alt="HamroNYC"
              className="h-9 w-9 rounded-2xl object-contain ring-1 ring-gray-100"
            />
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{ color: ACCENT }}
            >
              HamroNYC.com
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map(({ name, path, authOnly }) => {
            if (authOnly && !isLoggedIn) return null;
            return (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ""}`
                }
              >
                {name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-gray-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/post-listing"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ ["--accent"]: ACCENT }}
              >
                <Plus size={16} />
                Post
              </Link>

              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700 ring-1 ring-gray-200"
                title="Profile"
              >
                {initials}
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                disabled={isLoading}
              >
                <LogOut size={16} />
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center rounded-xl border border-gray-200 bg-white p-2 md:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden">
          <nav className="mx-auto max-w-6xl space-y-1 px-4 pb-4">
            {navItems.map(({ name, path, authOnly }) => {
              if (authOnly && !isLoggedIn) return null;
              return (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-[15px] font-semibold ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    }`
                  }
                >
                  {name}
                </NavLink>
              );
            })}

            <div className="mt-2 grid grid-cols-2 gap-2">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-800"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-xl bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-800"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl bg-[var(--accent,#CD4A3D)] px-3 py-2 text-center text-sm font-semibold text-white"
                    style={{ ["--accent"]: ACCENT }}
                    disabled={isLoading}
                  >
                    {isLoading ? "…" : "Logout"}
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
});

export default Header;
