import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        Home
      </Link>
      <Link to="/products" className={location.pathname === "/products" ? "active" : ""}>
        Ürünler
      </Link>
      <Link to="/sales" className={location.pathname === "/sales" ? "active" : ""}>
        Satışlar
      </Link>
      <Link to="/stocks" className={location.pathname === "/stocks" ? "active" : ""}>
        Stoklar
      </Link>
    </nav>
  );
}

export default Navbar;
