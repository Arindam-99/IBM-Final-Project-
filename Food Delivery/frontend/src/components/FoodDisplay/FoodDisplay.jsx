import React, { useContext } from "react";
import "./Fooddisplay.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const Fooddisplay = ({ category, searchQuery }) => {
  const {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    loading,
    error,
    refreshFoodData,
  } = useContext(StoreContext);

  // Filter food items based on category and search query
  const getFilteredFoodList = () => {
    let filteredList = food_list;

    // Filter by category first
    if (category !== "All") {
      filteredList = filteredList.filter((item) => item.category === category);
    }

    // Then filter by search query if provided
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filteredList = filteredList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredList;
  };

  const filteredFoodList = getFilteredFoodList();

  // Debug logging
  console.log("🔍 FoodDisplay Debug:", {
    category,
    searchQuery,
    totalItems: food_list.length,
    filteredItems: filteredFoodList.length,
    categories: [...new Set(food_list.map((item) => item.category))],
  });

  // Loading state
  if (loading && food_list.length === 0) {
    return (
      <div className="food-display" id="food-display">
        <h2>Top dishes near you</h2>
        <div className="food-loading">
          <div className="food-loading-spinner"></div>
          <p>Loading delicious dishes...</p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error && food_list.length === 0) {
    return (
      <div className="food-display" id="food-display">
        <h2>Top dishes near you</h2>
        <div className="food-error">
          <p>❌ {error}</p>
          <button onClick={refreshFoodData} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : category === "All"
            ? "Top dishes near you"
            : `${category} dishes`}
        </h2>
        {searchQuery && (
          <p className="search-info">
            Found {filteredFoodList.length}{" "}
            {filteredFoodList.length === 1 ? "item" : "items"}
          </p>
        )}
        {loading && (
          <div className="food-updating">
            <i className="fas fa-sync-alt update-indicator"></i>
            <span>Updating...</span>
          </div>
        )}
        <button
          onClick={refreshFoodData}
          className="refresh-btn"
          title="Refresh food data"
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>
      <div className="food-display-list">
        {filteredFoodList.length === 0 ? (
          <div className="no-items-found">
            <div className="no-items-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>
              {searchQuery
                ? `No items found for "${searchQuery}"`
                : `No items found in "${category}" category`}
            </h3>
            <p>
              {searchQuery
                ? "Try searching with different keywords or browse our categories."
                : "Try selecting a different category or check back later for new items."}
            </p>
            <button onClick={refreshFoodData} className="btn btn-primary">
              <i className="fas fa-sync-alt"></i> Refresh Menu
            </button>
          </div>
        ) : (
          filteredFoodList.map((item, index) => (
            <div key={index} className="food-item">
              <div className="food-item-img-container">
                <img
                  className="food-item-image"
                  src={item.image}
                  alt={item.name}
                />
                {!cartItems[item._id] ? (
                  <img
                    className="add-icon"
                    onClick={() => addToCart(item._id)}
                    src={assets.add_icon_white}
                    alt="Add to cart"
                  />
                ) : (
                  <div className="food-item-counter">
                    <img
                      onClick={() => removeFromCart(item._id)}
                      src={assets.remove_icon_red}
                      alt="Remove from cart"
                    />
                    <p>{cartItems[item._id]}</p>
                    <img
                      onClick={() => addToCart(item._id)}
                      src={assets.add_icon_green}
                      alt="Add to cart"
                    />
                  </div>
                )}
              </div>
              <div className="food-item-info">
                <div className="food-item-name-rating">
                  <p>{item.name}</p>
                  <div className="food-item-rating">
                    <img src={assets.rating_starts} alt="Rating" />
                  </div>
                </div>
                <p className="food-item-desc">{item.description}</p>
                <p className="food-item-price">
                  ₹{Math.round(item.price * 75)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Fooddisplay;
