// components/HeroBanner.jsx
import React from "react";
import Hero from "../../../assets/img/HamroNYC.com.png";

const HeroBanner = () => (
  <div className="flex items-center justify-center">
    <img
      src={Hero}
      alt="Hero"
      className="max-w-full h-48 object-contain md:h-64 lg:h-72"
    />
  </div>
);

export default HeroBanner;
