import React from "react";
import { assets } from "../../assets/assets";
import "./AppDownload.css";

const AppDownload = () => {
  return (
    <section className="app-download" id="app-download">
      <div className="container">
        <div className="app-download-content">
          <div className="app-download-text fade-in">
            <h2>For Better Experience Download Ari's Cafe App</h2>
            <p>
              Get the best food delivery experience with our mobile app. Enjoy
              exclusive deals, faster ordering, real-time tracking, and much
              more!
            </p>

            <div className="app-features">
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <span>Faster Ordering</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📍</span>
                <span>Real-time Tracking</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💰</span>
                <span>Exclusive Deals</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔔</span>
                <span>Push Notifications</span>
              </div>
            </div>

            <div className="download-buttons">
              <a
                href="#"
                className="download-btn apple-btn hover-lift"
                aria-label="Download on App Store"
              >
                <img src={assets.app_store} alt="Download on App Store" />
              </a>
              <a
                href="#"
                className="download-btn google-btn hover-lift"
                aria-label="Get it on Google Play"
              >
                <img src={assets.play_store} alt="Get it on Google Play" />
              </a>
            </div>

            <div className="app-stats">
              <div className="stat">
                <div className="stat-number">4.8★</div>
                <div className="stat-label">App Store Rating</div>
              </div>
              <div className="stat">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Downloads</div>
              </div>
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
          </div>

          <div className="app-download-image slide-in-right">
            <div className="phone-mockup">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="app-interface">
                    <div className="app-header">
                      <div className="status-bar">
                        <span>9:41</span>
                        <span>100%</span>
                      </div>
                      <div className="app-title">Ari's Cafe</div>
                    </div>

                    <div className="app-content">
                      <div className="search-bar">
                        <span>🔍 Search for restaurants...</span>
                      </div>

                      <div className="food-categories">
                        <div className="category-item">🍕</div>
                        <div className="category-item">🍔</div>
                        <div className="category-item">🍜</div>
                        <div className="category-item">🥗</div>
                      </div>

                      <div className="featured-restaurant">
                        <div className="restaurant-image"></div>
                        <div className="restaurant-info">
                          <div className="restaurant-name">Pizza Palace</div>
                          <div className="restaurant-rating">
                            ⭐ 4.8 • 25-30 min
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="phone-button"></div>
              </div>

              <div className="floating-elements">
                <div className="floating-icon icon-1">🍕</div>
                <div className="floating-icon icon-2">🍔</div>
                <div className="floating-icon icon-3">🥗</div>
                <div className="floating-icon icon-4">🍜</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
