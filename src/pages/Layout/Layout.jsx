// src/layouts/Layout.jsx
import React, { useRef, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Home/Components/Footer";

function Layout() {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 0;
      setHeaderHeight(Math.ceil(h));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Attach ref to Header */}
      <Header ref={headerRef} />

      {/* Push page content below header */}
      <main
        style={{ marginTop: headerHeight }}
        className="flex-1"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
