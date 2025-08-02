import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../appwrite/auth";

function Header({ref}) {
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
    { name: "Post Your Listing", path: "/post-listing" },
    { name: "My Posts", path: "/my-posts" },
  ];

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
  }, [location.pathname]); // ✅ run when route changes

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

  const linkStyle = "text-sm font-bold custom-primary";
  const activeStyle = "text-red-600 border-b-2 border-red-600"; // ✅ active link styling

  return (
    <header ref={ref} className="flex items-center justify-between bg-white shadow-sm p-4 md:p-6 w-full">
      <Link to="/" className="flex items-center">
        <img
          src="/img/logo.png"
          alt="Nepali Connect NYC"
          className="w-10 h-10 rounded-full mr-3 object-contain"
        />
        <span className="text-3xl font-bold custom-primary">HamroNYC.com</span>
      </Link>

      <nav className="flex items-center space-x-6">
        {categories.map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            className={`${linkStyle} ${location.pathname === path ? activeStyle : ""
              }`}
          >
            {name}
          </Link>
        ))}

        <Link
          to="/profile"
          className={`${linkStyle} ${location.pathname === "/profile" ? activeStyle : ""
            }`}
        >
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
