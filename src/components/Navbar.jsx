import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";
const Navbar = ({
  getCartCount,
  userProfile,
  currentUser,
  handleLogout,
  setShowProfileModal,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  return (
    <nav className="nd-nav">
      <div className="nd-nav-inner">
        <Link to="/" className="nd-logo">
          {/* Logo */}
          <div className="logo">
            {/* Replace with your actual logo */}
            <Logo className="logo-img" />
            <span className="logo-text">CalorieCrafter</span>
          </div>
        </Link>
        {/* Navigation Links */}
        <div className="nd-nav-links">
          <Link
            to="/dashboard"
            className={`nd-nav-link ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/menu"
            className={`nd-nav-link ${
              location.pathname === "/menu" ? "active" : ""
            }`}
          >
            Browse Menu
          </Link>

          <Link
            to="/orders"
            className={`nd-nav-link ${
              location.pathname === "/orders" ? "active" : ""
            }`}
          >
            My Orders
          </Link>
        </div>
        {/* Right Section */}
        <div className="nd-nav-right">
          {/* Cart */}
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              background: "#f1f5f9",
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 600,
              fontSize: 14,
              position: "relative",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span>Cart</span>

            {getCartCount && getCartCount() > 0 && (
              <span className="nd-cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {/* User Menu */}
          <div className="nd-user-menu">
            <button
              className="nd-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
            </button>

            {showUserMenu && (
              <div className="nd-dropdown">
                <div className="nd-drop-head">
                  <div className="nd-drop-name">{userProfile?.name}</div>
                  <div className="nd-drop-email">{currentUser?.email}</div>
                </div>

                <div className="nd-drop-divider" />

                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="nd-drop-item"
                >
                  ⚙️ Update Health Profile
                </button>

                <Link to="/profile" className="nd-drop-item">
                  👤 Account Settings
                </Link>

                <button onClick={handleLogout} className="nd-drop-item danger">
                  → Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
