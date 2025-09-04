import React from "react";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
  const handleViewMenu = () => {
    const foodDisplaySection = document.getElementById("food-display");
    if (foodDisplaySection) {
      foodDisplaySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from our diverse menu featuring cuisines from around the world.
          Fresh ingredients, authentic flavors, delivered hot to your doorstep.
        </p>
        <button onClick={handleViewMenu} className="view-menu-btn">
          View Menu
        </button>
      </div>
    </div>
  );
};

export default Header;
