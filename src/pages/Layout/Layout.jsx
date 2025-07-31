import React from "react";
import { Outlet } from "react-router-dom"; // ✅ Import Outlet
import Header from "../Navbar/Header";
import Footer from "../Home/Components/Footer";

function Layout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* ✅ Use JSX-style comment */}
      <Footer/>
    </div>
  );
}

export default Layout;
