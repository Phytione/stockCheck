import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FaBoxes, FaShoppingCart, FaChartBar, FaTag, FaHome } from 'react-icons/fa';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="layout">
      {/* Masaüstü ve Mobil Menü Paneli */}
      <div className="sidebar">
        <div className="sidebar-header">
          Stok Takip
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/products" className={location.pathname === "/products" ? "active" : ""}>
                <FaBoxes />
                <span>Ürünler</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/sales" className={location.pathname === "/sales" ? "active" : ""}>
                <FaShoppingCart />
                <span>Satışlar</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/stocks" className={location.pathname === "/stocks" ? "active" : ""}>
                <FaChartBar />
                <span>Stoklar</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/topsales" className={location.pathname === "/topsales" ? "active" : ""}>
                <FaTag />
                <span>En Çok Satanlar</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Ana içerik alanı */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;