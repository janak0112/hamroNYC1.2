// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-[rgb(205,74,61)] pt-10 pb-6 border-t border-[rgb(205,74,61)]">
      <div className="container mx-auto px-6 md:flex md:justify-between md:items-start">
        {/* Branding */}
        <div className="mb-6 md:mb-0">
        <Link to="/" className="flex items-center mb-4">
        <img
          src="/img/logo.png"
          alt="Nepali Connect NYC"
          className="w-10 h-10 rounded-full mr-3 object-contain"
        />
        <span className="text-3xl font-bold custom-primary">HamroNYC.com</span>
      </Link>
          <p className="text-[rgb(205,74,61)] max-w-sm">
            Your Nepali community hub in New York — find jobs, rooms, markets,
            and events with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="text-[rgb(205,74,61)] space-y-1">
            <li>
              <Link to="/jobs" className="hover:text-white">
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="hover:text-white">
                Rooms
              </Link>
            </li>
            <li>
              <Link to="/market" className="hover:text-white">
                Market
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-white">
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* More Info */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Info</h3>
          <ul className="text-gray-400 space-y-1">
            <li>
              <Link to="/about" className="text-[rgb(205,74,61)] hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-[rgb(205,74,61)] hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-[rgb(205,74,61)] hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect with Us</h3>
          <div className="flex space-x-4 text-white">
            <a href="#" className="hover:text-white">
              <Facebook size={20} className="text-[rgb(205,74,61)]" />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram size={20} className="text-[rgb(205,74,61)]" />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={20} className="text-[rgb(205,74,61)]" />
            </a>
            <a href="mailto:support@hamronyc.com" className="hover:text-white">
              <Mail size={20} className="text-[rgb(205,74,61)]" />
            </a>
            <a href="https://hamronyc.com" className="hover:text-white">
              <Globe size={20} className="text-[rgb(205,74,61)]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-[rgb(205,74,61)] pt-4 text-center text-sm text-[rgb(205,74,61)]">
        © {new Date().getFullYear()} Hamro NYC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
