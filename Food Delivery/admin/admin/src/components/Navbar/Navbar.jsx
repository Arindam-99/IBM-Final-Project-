import React from "react";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const currentTime = new Date().toLocaleString();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="page-title">Food Delivery Admin Panel</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-info">
          <span className="current-time">{currentTime}</span>
        </div>

        <div className="navbar-actions">
          <button className="notification-btn">
            <i className="fas fa-bell notification-icon"></i>
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu">
            <div className="user-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
