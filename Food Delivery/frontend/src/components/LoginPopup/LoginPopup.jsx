import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin, showToast }) => {
  const [currState, setCurrState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Close popup on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowLogin(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setShowLogin]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (currState === "Sign Up" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const message = currState === "Login" 
        ? "Successfully logged in!" 
        : "Account created successfully!";
      showToast(message, "success");
      setShowLogin(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLogin(false);
    }
  };

  return (
    <div className="login-popup" onClick={handleOverlayClick}>
      <form onSubmit={handleSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            className="close-icon"
          />
        </div>
        
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <div className="input-group">
              <input
                name="name"
                onChange={handleChange}
                value={formData.name}
                type="text"
                placeholder="Your name"
                className={errors.name ? "error" : ""}
                required
              />
              {errors.name && (
                <span className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>
          )}
          
          <div className="input-group">
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              type="email"
              placeholder="Your email"
              className={errors.email ? "error" : ""}
              required
            />
            {errors.email && (
              <span className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          
          <div className="input-group">
            <input
              name="password"
              onChange={handleChange}
              value={formData.password}
              type="password"
              placeholder="Password"
              className={errors.password ? "error" : ""}
              required
            />
            {errors.password && (
              <span className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className={`login-popup-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading 
            ? (currState === "Sign Up" ? "Creating Account..." : "Logging In...")
            : (currState === "Sign Up" ? "Create account" : "Login")
          }
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")} className="toggle-link">
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")} className="toggle-link">
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
