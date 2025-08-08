import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../appwrite/auth";
import { toast } from "react-toastify";

function Header({ ref }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route path

  const categories = [
    { name: "Home", path: "/" },
    { name: "Job", path: "/jobs" },
    { name: "Room", path: "/rooms" },
    { name: "Market", path: "/market" },
    { name: "Events", path: "/events" },
    { name: "Post Your Listing", path: "/post-listing", logOut: true },
    { name: "My Posts", path: "/my-posts", logOut: true },
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          localStorage.setItem("userId", user.$id);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("User fetch error:", err);
        setIsLoggedIn(false);
      }
    };
    checkUser();
  }, [location.pathname]); // ✅ run when route changes

  const handleLogout = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await authService.logout();
      toast.success("👋 You have been logged out successfully!");
      setIsLoggedIn(false); // ✅ this hides logged-in-only links
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("⚠️ Logout failed. Please try again.");
      setErrorMessage("Failed to logout.");
    } finally {
      setIsLoading(false);
    }
  };

  const linkStyle = "text-sm font-bold custom-primary";
  const activeStyle = "text-red-600 border-b-2 border-red-600"; // ✅ active link styling

  return (
    <header
      ref={ref}
      className="flex items-center justify-between bg-white shadow-sm p-4 md:p-6 w-full"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        {/* <img
          src={logo}
          alt="Nepali Connect NYC"
          className="w-20 h-20  mr-3 object-contain"
        /> */}
        <span className="text-3xl font-bold custom-primary">hamroNYC.com</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {categories.map(({ name, path, logOut }) => {
          if (logOut && !isLoggedIn) return null; // hide if requires login
          return (
            <Link
              key={name}
              to={path}
              className={`${linkStyle} ${
                location.pathname === path ? activeStyle : ""
              }`}
            >
              {name}
            </Link>
          );
        })}

        {/* Profile (only visible when logged in) */}
        {isLoggedIn && (
          <Link
            to="/profile"
            className={`${linkStyle} ${
              location.pathname === "/profile" ? activeStyle : ""
            }`}
          >
            Profile
          </Link>
        )}

        {/* Auth Buttons */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-700 font-bold border custom-primary-border rounded-md px-4 py-2 hover:bg-gray-50"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm text-white font-bold custom-primary-bg rounded-md px-4 py-2 custom-primary-bg-hover"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-sm text-white font-bold custom-primary-bg rounded-md px-4 py-2 custom-primary-bg-hover"
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
