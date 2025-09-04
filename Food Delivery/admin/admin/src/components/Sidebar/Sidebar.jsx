import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      icon: "fas fa-chart-line",
      label: "Dashboard",
      active: location.pathname === "/dashboard" || location.pathname === "/",
    },
    {
      path: "/food-items",
      icon: "fas fa-utensils",
      label: "Food Items",
      active: location.pathname === "/food-items",
    },
    {
      path: "/add-food",
      icon: "fas fa-plus-circle",
      label: "Add Food",
      active:
        location.pathname === "/add-food" ||
        location.pathname.includes("/edit-food"),
    },
    {
      path: "/restaurants",
      icon: "fas fa-store",
      label: "Restaurants",
      active: location.pathname === "/restaurants",
    },
    {
      path: "/add-restaurant",
      icon: "fas fa-building",
      label: "Add Restaurant",
      active:
        location.pathname === "/add-restaurant" ||
        location.pathname.includes("/edit-restaurant"),
    },
    {
      path: "/users",
      icon: "fas fa-users",
      label: "Users",
      active: location.pathname === "/users",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-utensils logo-icon"></i>
            <h2>Ari's Admin</h2>
          </div>
          <button className="close-btn" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${item.active ? "active" : ""}`}
              >
                <Link
                  to={item.path}
                  className="nav-link"
                  onClick={() => window.innerWidth <= 768 && toggleSidebar()}
                >
                  <i className={`nav-icon ${item.icon}`}></i>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="admin-details">
              <p className="admin-name">Admin User</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
