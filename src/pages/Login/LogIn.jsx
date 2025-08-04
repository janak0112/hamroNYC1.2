import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth"; // Adjust path to your AuthService file
import { FcGoogle } from "react-icons/fc"; // Google icon

function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      console.log("Submitting login:", {
        email: data.email,
        password: data.password,
      });
      await authService.login({
        email: data.email,
        password: data.password,
      });
      navigate("/"); // Redirect to dashboard or another route
    } catch (error) {
      console.error("Login Error:", error);
      if (error.code === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage(
          error.message || "Failed to sign in. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      // Replace with your authService method for Google login
      await authService.loginWithGoogle();

      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage(error.message || "Failed to sign in with Google.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await authService.loginWithFacebook(); // Replace with your service method
      navigate("/");
    } catch (error) {
      console.error("Facebook Login Error:", error);
      setErrorMessage(error.message || "Failed to sign in with Facebook.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4 mt-20 mb-20"
    >
      {errorMessage && (
        <p
          role="alert"
          className="text-sm text-center"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errorMessage}
        </p>
      )}

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-2 border border-gray-300 rounded font-medium hover:bg-gray-100"
      >
        <FcGoogle size={24} className="mr-2" />
        Continue with Google
      </button>

      {/* Facebook Login */}
      <button
        type="button"
        onClick={handleFacebookLogin}
        className="w-full flex items-center justify-center py-2 border border-gray-300 rounded font-medium hover:bg-gray-100"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png"
          alt="Facebook"
          className="w-6 h-6 mr-2"
        />
        Continue with Facebook
      </button>

      {/* Divider with OR */}
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-invalid={errors.email ? "true" : "false"}
      />
      {errors.email && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errors.email.message}
        </p>
      )}

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-invalid={errors.password ? "true" : "false"}
      />
      {errors.password && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errors.password.message}
        </p>
      )}

      {/* Sign In Button */}
      <button
        type="submit"
        className="w-full py-2 rounded text-white font-semibold"
        style={{ backgroundColor: "rgba(212, 17, 56, 1)" }}
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

export default LogIn;
