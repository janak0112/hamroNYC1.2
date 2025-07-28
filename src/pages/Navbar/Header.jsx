import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import listingService from "../../appwrite/config";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const categories = [
    { name: "Home", path: "/" },
    { name: "Job", path: "/jobs" },
    { name: "Room", path: "/rooms/room-list" },
    { name: "Market", path: "/markets" },
    { name: "Events", path: "/events" },
    { name: "Post Your Listing", path: "/post-listing" },
  ];

  // Check login status on mount & when route changes
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        localStorage.setItem("userId", user.$id);

        setIsLoggedIn(!!user);
      } catch (err) {
        console.error("User fetch error:", err);
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, [location.pathname]); // ⬅ update on every route change

  const handleLogout = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await authService.logout();
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      setErrorMessage("Failed to logout.");
    } finally {
      setIsLoading(false);
    }
  };

  const linkStyle = "text-sm font-bold custom-primary hover:underline";

  return (
    <header className="flex items-center justify-between bg-white shadow-sm p-4 md:p-6 w-full">
      <Link to="/" className="flex items-center">
        <img
          src="/img/logo.png"
          alt="Nepali Connect NYC"
          className="w-10 h-10 rounded-full mr-3 object-contain"
        />
        <span className="text-2xl font-bold custom-primary">Logo</span>
      </Link>

      <nav className="flex items-center space-x-6">
        {categories.map(({ name, path }) => (
          <Link key={name} to={path} className={linkStyle}>
            {name}
          </Link>
        ))}

        <Link to="/" className={linkStyle}>
          Profile
        </Link>

        {!isLoggedIn && (
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
        )}

        {isLoggedIn && (
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
