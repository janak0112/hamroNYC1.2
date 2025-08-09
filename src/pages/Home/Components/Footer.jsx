// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const ACCENT = "#CD4A3D";

const IconButton = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-sm"
    style={{ color: ACCENT }}
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white/90 backdrop-blur">
      {/* Top strip */}
      <div className="bg-gradient-to-r from-[#fff6f5] via-white to-[#fff6f5]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <img
              src="/img/logo.png"
              alt="HamroNYC logo"
              className="h-10 w-10 rounded-2xl object-contain ring-1 ring-gray-100"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                HamroNYC.com
              </p>
              <p className="text-xs text-gray-600">
                Nepali community hub in New York
              </p>
            </div>
          </div>

          <p className="hidden text-sm text-gray-600 sm:block">
            Find jobs, rooms, market deals, and events—organized and local.
          </p>

          <div className="flex justify-start gap-2 sm:justify-end">
            <Link
              to="/rooms/post"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Post a listing <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      {/* Middle content */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand + blurb */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-3 flex items-center">
              <span
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: ACCENT }}
              >
                HamroNYC.com
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              Your trusted space for Nepalis in NYC—post and discover verified
              community listings.
            </p>

            <div className="mt-4 flex gap-2">
              <IconButton href="https://facebook.com" label="Facebook">
                <Facebook size={18} />
              </IconButton>
              <IconButton href="https://instagram.com" label="Instagram">
                <Instagram size={18} />
              </IconButton>
              <IconButton href="https://twitter.com" label="Twitter / X">
                <Twitter size={18} />
              </IconButton>
              <IconButton
                href="mailto:support@hamronyc.com"
                label="Email support"
              >
                <Mail size={18} />
              </IconButton>
              <IconButton href="https://hamronyc.com" label="Website">
                <Globe size={18} />
              </IconButton>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { to: "/jobs", label: "Jobs" },
                { to: "/rooms", label: "Rooms" },
                { to: "/market", label: "Market" },
                { to: "/events", label: "Events" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-600 transition hover:text-gray-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Info</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-600 transition hover:text-gray-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (optional) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Get community updates
            </h3>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10"
              />
              <button
                type="submit"
                className="rounded-xl bg-[var(--accent,#CD4A3D)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ ["--accent"]: ACCENT }}
              >
                Join
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-100" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-gray-600 md:flex-row">
          <p>© {new Date().getFullYear()} HamroNYC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="transition hover:text-gray-900">
              Terms
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/privacy" className="transition hover:text-gray-900">
              Privacy
            </Link>
            <span className="text-gray-300">•</span>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 transition hover:bg-gray-50"
              title="Change language"
            >
              English (US)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
