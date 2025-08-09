// components/Auth/LogIn.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

const ACCENT = "#CD4A3D";

function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  const onSubmit = async (data) => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await authService.login({ email: data.email, password: data.password });
      toast.success("Logged in successfully!");
      navigate(redirectTo);
    } catch (error) {
      console.error("Login Error:", error);
      if (error?.code === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage(
          error?.message || "Failed to sign in. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
      navigate(redirectTo);
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage(error?.message || "Failed to sign in with Google.");
      toast.error("⚠️ Login failed. Please try again.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await authService.loginWithFacebook();
      navigate(redirectTo);
    } catch (error) {
      console.error("Facebook Login Error:", error);
      setErrorMessage(error?.message || "Failed to sign in with Facebook.");
      toast.error("⚠️ Login failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto my-16 max-w-md px-4">
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
            className="mx-auto mb-3 inline-flex items-center justify-center rounded-2xl p-2 ring-1 ring-[var(--accent,#CD4A3D)]/20"
            style={{ background: "rgba(205,74,61,.08)", ["--accent"]: ACCENT }}
          >
            <ShieldCheck className="h-5 w-5 text-[var(--accent,#CD4A3D)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your HamroNYC account.
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
              onClick={handleGoogleLogin}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
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
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 ${
                    errors.email
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200"
                  }`}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
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
                  placeholder="Your password"
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Extras */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {/* Uncomment if you wire it up:
                <input type="checkbox" id="remember" className="h-4 w-4" />
                <label htmlFor="remember">Remember me</label> */}
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-gray-800 underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:bg-gray-400"
              style={{ ["--accent"]: ACCENT }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <p className="mt-3 text-center text-sm text-gray-600">
              New here?{" "}
              <Link
                to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-semibold text-gray-900 underline-offset-2 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
