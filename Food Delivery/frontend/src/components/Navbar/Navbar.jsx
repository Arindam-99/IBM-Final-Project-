import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

const Navbar = ({ setShowLogin, showToast }) => {
  const [menu, setMenu] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { getTotalCartAmount } = useContext(StoreContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update active menu based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setMenu("home");
    else if (path === "/cart") setMenu("cart");
    else if (path.includes("/auth")) setMenu("auth");
  }, [location]);

  // Removed mobile menu click outside handler

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      showToast(`Searching for "${searchQuery}"...`, "info");
    }
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search suggestions (optional enhancement)
  const handleQuickSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    showToast(`Searching for "${query}"...`, "info");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Removed mobile menu close
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={assets.logo} alt="Ari's Cafe Logo" className="logo" />
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link
              to="/"
              onClick={() => setMenu("home")}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#explore-menu"
              onClick={(e) => {
                e.preventDefault();
                setMenu("menu");
                scrollToSection("explore-menu");
              }}
              className={menu === "menu" ? "active" : ""}
            >
              Menu
            </a>
          </li>
          <li>
            <a
              href="#app-download"
              onClick={(e) => {
                e.preventDefault();
                setMenu("mobile_app");
                scrollToSection("app-download");
              }}
              className={menu === "mobile_app" ? "active" : ""}
            >
              Mobile App
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                setMenu("contact");
                scrollToSection("footer");
              }}
              className={menu === "contact" ? "active" : ""}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="navbar-right">
          <div className={`navbar-search ${isSearchOpen ? "search-open" : ""}`}>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search restaurants, dishes..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
                aria-label="Search"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
              />
              <button
                type="submit"
                className="search-submit"
                aria-label="Submit search"
              >
                <img src={assets.search_icon} alt="Search" />
              </button>
            </form>
            <button
              className="search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <img src={assets.search_icon} alt="Search" />
            </button>
          </div>

          <Link to="/cart" className="navbar-basket-icon">
            <img src={assets.basket_icon} alt="Shopping Cart" />
            {getTotalCartAmount() > 0 && (
              <div className="cart-count">
                {Object.values(getTotalCartAmount()).length}
              </div>
            )}
          </Link>

          <ThemeToggle />

          {/* Clerk Authentication Section */}
          <SignedOut>
            <div className="auth-buttons">
              <SignInButton mode="modal">
                <button className="navbar-login-btn">
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="navbar-signup-btn">
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="user-menu">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-lg",
                    userButtonPopoverActionButton: "hover:bg-gray-100",
                  },
                }}
                showName={true}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
