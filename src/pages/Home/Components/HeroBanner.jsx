// components/HeroBanner.jsx
import React from "react";
import Hero from "../../../assets/img/hero.svg";

const HeroBanner = () => (
  <div className="flex items-center justify-center">
    <img src={Hero} alt="Hero" className="max-w-full h-auto" />
  </div>
);

export default HeroBanner;
