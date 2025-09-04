import React from "react";
import { assets } from "../../assets/assets";
import "./FeaturedRestaurants.css";

const FeaturedRestaurants = () => {
  const restaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf2N3aZf5qQ8QlJW8T2_nPCEu29Xf5c93g2A&s",
      rating: 4.8,
      deliveryTime: "25-30 min",
      cuisine: "Italian, Pizza",
      badge: "Best Seller",
      discount: "20% OFF",
    },
    {
      id: 2,
      name: "Burger Barn",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
      rating: 4.6,
      deliveryTime: "20-25 min",
      cuisine: "American, Burgers",
      badge: "Popular",
      discount: "15% OFF",
    },
    {
      id: 3,
      name: "Sushi Sensation",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center",
      rating: 4.9,
      deliveryTime: "30-35 min",
      cuisine: "Japanese, Sushi",
      badge: "Premium",
      discount: "10% OFF",
    },
    {
      id: 4,
      name: "Taco Fiesta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Xt9-od37IvYn-uqgnGYBk1H4FqsiUNJlhw&s",
      rating: 4.7,
      deliveryTime: "15-20 min",
      cuisine: "Mexican, Tacos",
      badge: "Fast Delivery",
      discount: "25% OFF",
    },
    {
      id: 5,
      name: "Spice Garden",
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center",
      rating: 4.5,
      deliveryTime: "20-25 min",
      cuisine: "Indian, Curry",
      badge: "Authentic",
      discount: "18% OFF",
    },
    {
      id: 6,
      name: "Pasta Corner",
      image:
        "https://s2.dmcdn.net/v/9apRB1LUZavlOYOov/x480",
      rating: 4.4,
      deliveryTime: "22-28 min",
      cuisine: "Italian, Pasta",
      badge: "Chef's Special",
      discount: "12% OFF",
    },
  ];

  return (
    <section className="featured-restaurants" id="featured-restaurants">
      <div className="container">
        <div className="section-header fade-in">
          <h2>Featured Restaurants</h2>
          <p>Discover the best restaurants in your area</p>
        </div>

        <div className="restaurants-grid">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className={`restaurant-card hover-lift fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="restaurant-image-container">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="restaurant-image"
                  loading="lazy"
                />
                <div className="restaurant-badges">
                  {restaurant.badge && (
                    <span
                      className={`badge ${restaurant.badge
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {restaurant.badge}
                    </span>
                  )}
                  {restaurant.discount && (
                    <span className="discount-badge">
                      {restaurant.discount}
                    </span>
                  )}
                </div>
                <div className="restaurant-overlay">
                  <button
                    className="view-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Scroll to food display section
                      const foodDisplaySection =
                        document.getElementById("food-display");
                      if (foodDisplaySection) {
                        foodDisplaySection.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    View Menu
                  </button>
                </div>
              </div>

              <div className="restaurant-info">
                <div className="restaurant-header">
                  <h3>{restaurant.name}</h3>
                  <div className="rating">
                    <span className="star">⭐</span>
                    <span className="rating-value">{restaurant.rating}</span>
                  </div>
                </div>

                <p className="cuisine">{restaurant.cuisine}</p>

                <div className="restaurant-footer">
                  <div className="delivery-info">
                    <span className="delivery-icon">🚚</span>
                    <span className="delivery-time">
                      {restaurant.deliveryTime}
                    </span>
                  </div>
                  <button
                    className="order-btn"
                    onClick={() => {
                      // Scroll to food display section
                      const foodDisplaySection =
                        document.getElementById("food-display");
                      if (foodDisplaySection) {
                        foodDisplaySection.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <button
            className="view-all-btn"
            onClick={() => {
              // Scroll to food display section
              const foodDisplaySection =
                document.getElementById("food-display");
              if (foodDisplaySection) {
                foodDisplaySection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            View All Restaurants
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
