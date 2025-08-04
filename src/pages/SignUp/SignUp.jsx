import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth"; // Adjust the path to your AuthService file
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import { FcGoogle } from "react-icons/fc"; // Google Icon

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const userId = ID.unique();
      const userName = `${data.firstName} ${data.lastName}`;
      await authService.createAccount({
        userId,
        email: data.mail,
        password: data.password,
        userName,
      });
      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authService.loginWithGoogle();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Failed to sign up with Google.");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      await authService.loginWithFacebook();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Failed to sign up with Facebook.");
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

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center py-2 border border-gray-300 rounded font-medium hover:bg-gray-100"
      >
        <FcGoogle size={24} className="mr-2" />
        Continue with Google
      </button>

      {/* Facebook Sign Up */}
      <button
        type="button"
        onClick={handleFacebookSignUp}
        className="w-full flex items-center justify-center py-2 border border-gray-300 rounded font-medium hover:bg-gray-100"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png"
          alt="Facebook"
          className="w-6 h-6 mr-2"
        />
        Continue with Facebook
      </button>

      {/* Divider */}
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* First Name */}
      <input
        placeholder="First Name"
        {...register("firstName", { required: "First name is required" })}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-invalid={errors.firstName ? "true" : "false"}
      />
      {errors.firstName && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errors.firstName.message}
        </p>
      )}

      {/* Last Name */}
      <input
        placeholder="Last Name"
        {...register("lastName", { required: "Last name is required" })}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-invalid={errors.lastName ? "true" : "false"}
      />
      {errors.lastName && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errors.lastName.message}
        </p>
      )}

      {/* Email */}
      <input
        placeholder="Email"
        {...register("mail", {
          required: "Email Address is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-invalid={errors.mail ? "true" : "false"}
      />
      {errors.mail && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errors.mail.message}
        </p>
      )}

      {/* Password */}
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

      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-invalid={errors.confirmPassword ? "true" : "false"}
      />
      {errors.confirmPassword && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "rgba(212, 17, 56, 1)" }}
        >
          {errors.confirmPassword.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 rounded text-white font-semibold"
        style={{ backgroundColor: "rgba(212, 17, 56, 1)" }}
        disabled={isLoading}
      >
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SignUp;
