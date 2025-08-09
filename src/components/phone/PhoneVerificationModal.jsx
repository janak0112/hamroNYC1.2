import React, { useEffect, useRef, useState } from "react";
import authService from "../../appwrite/auth";

export default function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
}) {
  const [step, setStep] = useState("phone"); // "phone" | "otp" | "done"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const phoneInputRef = useRef(null);
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep("phone");
    setPhone("");
    setOtp("");
    setUserId("");
    setErr("");
    setCooldown(0);
    // autofocus first input
    setTimeout(() => phoneInputRef.current?.focus(), 0);
  }, [isOpen]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendOtp = async () => {
    setErr("");
    if (!/^\+?[1-9]\d{6,14}$/.test(phone.trim())) {
      setErr(
        "Enter a valid phone in international format (e.g., +11234567890)."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await authService.startPhoneVerification(phone.trim());
      setUserId(res.userId);
      setStep("otp");
      setCooldown(60);
      setTimeout(() => otpInputRef.current?.focus(), 0);
    } catch (e) {
      setErr(e?.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setErr("");
    if (!otp.trim()) {
      setErr("Enter the code you received.");
      return;
    }
    setLoading(true);
    try {
      await authService.verifyPhoneCode(userId, otp.trim());
      setStep("done");
      onVerified?.();
    } catch (e) {
      setErr(e?.message || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    await sendOtp();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Verify your phone</h2>
          <button
            className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {step === "phone" && (
          <>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone number (E.164 format)
            </label>
            <input
              ref={phoneInputRef}
              type="tel"
              placeholder="+11234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-3 w-full rounded border px-3 py-2 outline-none focus:ring"
            />

            {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

            <button
              onClick={sendOtp}
              disabled={loading || !phone}
              className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              We’ll text you a 6‑digit code to verify this number.
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="mb-2 text-sm text-gray-700">
              Enter the 6‑digit code we sent to{" "}
              <span className="font-medium">{phone}</span>.
            </p>
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              pattern="\d{4,8}"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-3 w-full rounded border px-3 py-2 tracking-widest outline-none focus:ring"
            />

            {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

            <button
              onClick={verifyOtp}
              disabled={loading || !otp}
              className="mb-2 w-full rounded bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={resendOtp}
              disabled={loading || cooldown > 0}
              className="w-full rounded border px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
            </button>

            <button
              className="mt-3 w-full text-center text-xs text-gray-500 underline"
              onClick={() => setStep("phone")}
            >
              Use a different phone number
            </button>
          </>
        )}

        {step === "done" && (
          <div className="space-y-4 text-center">
            <div className="text-3xl">✅</div>
            <p className="text-green-700">
              Your phone is verified. You’re all set!
            </p>
            <button
              onClick={onClose}
              className="w-full rounded bg-black px-4 py-2 font-medium text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
