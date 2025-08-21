import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Flo Panel</h2>
        <nav>
          <ul>
            <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Ürün Yönetimi</NavLink></li>
            <li><NavLink to="/sales" className={({ isActive }) => isActive ? "active" : ""}>Satış Yönetimi</NavLink></li>
            <li><NavLink to="/stocks" className={({ isActive }) => isActive ? "active" : ""}>Stok Durumu</NavLink></li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <Outlet /> {/* seçilen sayfa buraya render olacak */}
      </main>
    </div>
  );
}

export default Layout;
