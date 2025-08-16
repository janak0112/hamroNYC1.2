// components/Auth/SignUp.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { useNavigate, Link } from "react-router-dom";
import { ID } from "appwrite";
import { FcGoogle } from "react-icons/fc";
import {
  Mail,
  Lock,
  User2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Facebook as FacebookIcon, // only for aria label; we still use brand image
} from "lucide-react";

const ACCENT = "#CD4A3D";

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const navigate = useNavigate();
  const password = watch("password") || "";

  const onSubmit = async (data) => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const userId = ID.unique();
      const userName =
        `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
      await authService.createAccount({
        userId,
        email: data.mail,
        password: data.password,
        userName,
      });
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error?.message || "Failed to create account. Please try again."
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
      setErrorMessage(error?.message || "Failed to sign up with Google.");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      await authService.loginWithFacebook();
      navigate("/");
    } catch (error) {
      setErrorMessage(error?.message || "Failed to sign up with Facebook.");
    }
  };

  const strength =
    password.length >= 10 ? "strong" : password.length >= 6 ? "medium" : "weak";

  return (
    <div className="mx-auto my-16 max-w-md px-4">
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#fff6f5] to-white shadow-sm"
        style={{
          boxShadow:
            "0 1px 0 rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.08)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center sm:px-8">
          <div
            className="mx-auto mb-3 inline-flex items-center justify-center rounded-2xl ring-1 ring-[var(--accent,#CD4A3D)]/20 p-2"
            style={{ background: "rgba(205,74,61,.08)", ["--accent"]: ACCENT }}
          >
            <ShieldCheck className="h-5 w-5 text-[var(--accent,#CD4A3D)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Join the Nepali community in NYC.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 sm:px-8">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* OAuth */}
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              <FcGoogle size={20} /> Continue with Google
            </button>
            <button
              type="button"
              onClick={handleFacebookSignUp}
              aria-label="Continue with Facebook"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png"
                alt=""
                className="h-5 w-5"
              />
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-3"
          >
            {/* First / Last */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-800">
                  First Name
                </label>
                <div className="relative">
                  <User2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="First name"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
                      errors.firstName
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200"
                    }`}
                    aria-invalid={!!errors.firstName}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-800">
                  Last Name
                </label>
                <div className="relative">
                  <User2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Last name"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
                      errors.lastName
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200"
                    }`}
                    aria-invalid={!!errors.lastName}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  placeholder="you@example.com"
                  {...register("mail", {
                    required: "Email address is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
                    errors.mail
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200"
                  }`}
                  aria-invalid={!!errors.mail}
                />
              </div>
              {errors.mail && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.mail.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="At least 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 pr-10 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200"
                  }`}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-2.5 rounded-md p-1 text-gray-500 hover:bg-gray-50"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className={`h-1.5 w-20 rounded-full ${
                      strength === "strong"
                        ? "bg-green-500"
                        : strength === "medium"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    Strength: {strength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showPwd2 ? "text" : "password"}
                  placeholder="Re-enter password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 pr-10 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200"
                  }`}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd2((s) => !s)}
                  className="absolute right-2 top-2.5 rounded-md p-1 text-gray-500 hover:bg-gray-50"
                  aria-label={showPwd2 ? "Hide password" : "Show password"}
                >
                  {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="mt-2 text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <Link
                to="/terms"
                className="font-semibold text-gray-700 underline-offset-2 hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-semibold text-gray-700 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:bg-gray-400"
              style={{ ["--accent"]: ACCENT }}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 underline-offset-2 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
