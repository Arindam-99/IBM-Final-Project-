import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { food_list, cartItems, addToCart, removeFromCart } =
    useContext(StoreContext);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query, food_list]);

  const performSearch = (searchQuery) => {
    setIsLoading(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const results = food_list.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
        );
      });

      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="search-results">
        <div className="search-header">
          <button className="back-btn" onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </button>
          <h1>Searching for "{query}"...</h1>
        </div>
        <div className="search-loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Finding delicious food for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <button className="back-btn" onClick={handleBackToHome}>
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </button>
        <h1>Search Results for "{query}"</h1>
        <p className="results-count">
          {searchResults.length} {searchResults.length === 1 ? "item" : "items"}{" "}
          found
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="search-results-grid">
          {searchResults.map((item, index) => (
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
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <i className="fas fa-search"></i>
          </div>
          <h2>No results found</h2>
          <p>We couldn't find any items matching "{query}"</p>
          <div className="search-suggestions">
            <h3>Try searching for:</h3>
            <div className="suggestion-tags">
              <span
                className="suggestion-tag"
                onClick={() => navigate("/?search=pizza")}
              >
                Pizza
              </span>
              <span
                className="suggestion-tag"
                onClick={() => navigate("/?search=burger")}
              >
                Burger
              </span>
              <span
                className="suggestion-tag"
                onClick={() => navigate("/?search=salad")}
              >
                Salad
              </span>
              <span
                className="suggestion-tag"
                onClick={() => navigate("/?search=pasta")}
              >
                Pasta
              </span>
              <span
                className="suggestion-tag"
                onClick={() => navigate("/?search=dessert")}
              >
                Dessert
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
