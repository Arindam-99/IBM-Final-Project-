import React, { useEffect, useState } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto hide after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "✓";
    }
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? "toast-show" : "toast-hide"}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button
        className="toast-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
