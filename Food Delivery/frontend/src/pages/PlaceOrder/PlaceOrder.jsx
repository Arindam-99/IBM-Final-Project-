import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";

const PlaceOrder = ({ showToast }) => {
  const { cartItems, food_list, getTotalCartAmount, setCartItems } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Order states
  const [orderStage, setOrderStage] = useState("checkout"); // 'checkout', 'confirmation', 'tracking'
  const [orderData, setOrderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    paymentMethod: "card",
  });

  // Tracking states
  const [trackingStage, setTrackingStage] = useState(0); // 0: confirmed, 1: preparing, 2: out for delivery, 3: delivered
  const [orderId, setOrderId] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(30);

  // Calculate order totals
  const subtotal = getTotalCartAmount();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  // Generate order ID
  useEffect(() => {
    if (orderStage === "confirmation") {
      const id = "ORD" + Date.now().toString().slice(-6);
      setOrderId(id);
    }
  }, [orderStage]);

  // Auto-progress tracking stages
  useEffect(() => {
    if (orderStage === "tracking") {
      const intervals = [3000, 8000, 15000]; // Time delays for each stage

      intervals.forEach((delay, index) => {
        setTimeout(() => {
          setTrackingStage(index + 1);
          setEstimatedTime((prev) => Math.max(0, prev - (index + 1) * 8));
        }, delay);
      });
    }
  }, [orderStage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "phone",
    ];
    const missingFields = requiredFields.filter(
      (field) => !orderData[field].trim()
    );

    if (missingFields.length > 0) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (subtotal === 0) {
      showToast("Your cart is empty", "warning");
      navigate("/cart");
      return;
    }

    // Simulate order placement
    setOrderStage("confirmation");
    showToast("Order placed successfully!", "success");

    // Clear cart after successful order
    setTimeout(() => {
      setCartItems({});
      localStorage.removeItem("cartItems");
    }, 2000);
  };

  const startTracking = () => {
    setOrderStage("tracking");
    setTrackingStage(0);
  };

  const trackingSteps = [
    {
      title: "Order Confirmed",
      description: "Your order has been received and confirmed",
      icon: "✅",
      time: "2 mins ago",
    },
    {
      title: "Preparing Food",
      description: "Our chefs are preparing your delicious meal",
      icon: "👨‍🍳",
      time: "In progress",
    },
    {
      title: "Out for Delivery",
      description: "Your order is on the way to your location",
      icon: "🏍️",
      time: "Estimated arrival",
    },
    {
      title: "Delivered",
      description: "Your order has been delivered successfully",
      icon: "🎉",
      time: "Completed",
    },
  ];

  // Redirect if cart is empty and not in tracking mode
  useEffect(() => {
    if (subtotal === 0 && orderStage === "checkout") {
      navigate("/cart");
    }
  }, [subtotal, orderStage, navigate]);

  if (orderStage === "checkout") {
    return (
      <div className="place-order">
        <div className="place-order-container">
          <div className="place-order-left">
            <h2 className="section-title">Delivery Information</h2>
            <form onSubmit={handleSubmit} className="delivery-form">
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={orderData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={orderData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={orderData.email}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address *"
                value={orderData.street}
                onChange={handleInputChange}
                required
              />

              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={orderData.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={orderData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={orderData.zipCode}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={orderData.country}
                  onChange={handleInputChange}
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={orderData.phone}
                onChange={handleInputChange}
                required
              />
            </form>
          </div>

          <div className="place-order-right">
            <div className="cart-total">
              <h2>Order Summary</h2>

              <div className="order-items">
                {Object.keys(cartItems).map((itemId) => {
                  if (cartItems[itemId] > 0) {
                    const item = food_list.find(
                      (product) => product._id === itemId
                    );
                    return (
                      <div key={itemId} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Qty: {cartItems[itemId]}</p>
                        </div>
                        <span className="item-price">
                          ₹{item.price * 75 * cartItems[itemId]}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <div className="cart-total-details">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="cart-total-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="cart-total-row total">
                  <strong>Total</strong>
                  <strong>₹{total}</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={orderData.paymentMethod === "card"}
                      onChange={handleInputChange}
                    />
                    <span className="payment-icon">💳</span>
                    Credit/Debit Card
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={orderData.paymentMethod === "upi"}
                      onChange={handleInputChange}
                    />
                    <span className="payment-icon">📱</span>
                    UPI Payment
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                    />
                    <span className="payment-icon">💰</span>
                    Cash on Delivery
                  </label>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="place-order-btn"
              >
                Place Order - ₹{total}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderStage === "confirmation") {
    return (
      <div className="order-confirmation">
        <div className="confirmation-container">
          <div className="confirmation-header">
            <div className="success-icon">
              <div className="checkmark">✓</div>
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>
              Thank you for your order. We've received your request and will
              start preparing your food shortly.
            </p>
          </div>

          <div className="order-details-card">
            <div className="order-info">
              <div className="order-id">
                <h3>
                  Order ID: <span className="highlight">{orderId}</span>
                </h3>
                <p>
                  Estimated delivery time:{" "}
                  <strong>{estimatedTime} minutes</strong>
                </p>
              </div>

              <div className="delivery-address">
                <h4>📍 Delivery Address</h4>
                <p>{orderData.street}</p>
                <p>
                  {orderData.city}, {orderData.state} {orderData.zipCode}
                </p>
                <p>📞 {orderData.phone}</p>
              </div>
            </div>

            <div className="order-summary-confirmation">
              <h4>Order Summary</h4>
              <div className="confirmation-items">
                {Object.keys(cartItems).map((itemId) => {
                  if (cartItems[itemId] > 0) {
                    const item = food_list.find(
                      (product) => product._id === itemId
                    );
                    return (
                      <div key={itemId} className="confirmation-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-info">
                          <h5>{item.name}</h5>
                          <p>Quantity: {cartItems[itemId]}</p>
                        </div>
                        <span className="item-total">
                          ₹{item.price * 75 * cartItems[itemId]}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <div className="confirmation-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="total-row final-total">
                  <strong>Total Paid:</strong>
                  <strong>₹{total}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="track-order-btn" onClick={startTracking}>
              Track Your Order 📍
            </button>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderStage === "tracking") {
    return (
      <div className="order-tracking">
        <div className="tracking-container">
          <div className="tracking-header">
            <h1>Track Your Order</h1>
            <div className="order-info-header">
              <span className="order-id-track">Order ID: {orderId}</span>
              <span className="estimated-time">
                {trackingStage < 3
                  ? `Estimated: ${estimatedTime} mins`
                  : "Delivered!"}
              </span>
            </div>
          </div>

          <div className="tracking-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((trackingStage + 1) / 4) * 100}%` }}
              ></div>
            </div>

            <div className="tracking-steps">
              {trackingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`tracking-step ${
                    index <= trackingStage ? "completed" : ""
                  } ${index === trackingStage ? "active" : ""}`}
                >
                  <div className="step-icon">
                    <span className="icon">{step.icon}</span>
                    {index <= trackingStage && (
                      <div className="check-overlay">✓</div>
                    )}
                  </div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <span className="step-time">
                      {index < trackingStage
                        ? "✓ Completed"
                        : index === trackingStage
                        ? step.time
                        : "Pending"}
                    </span>
                  </div>
                  {index === 2 && index === trackingStage && (
                    <div className="delivery-animation">
                      <div className="bike-icon">🏍️</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {trackingStage === 3 && (
            <div className="delivery-complete">
              <div className="celebration">
                <h2>🎉 Order Delivered Successfully! 🎉</h2>
                <p>
                  We hope you enjoy your meal! Thank you for choosing Ari's
                  Cafe.
                </p>
                <div className="rating-section">
                  <h4>Rate your experience:</h4>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="star">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="tracking-actions">
            <button className="home-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <button className="order-again-btn" onClick={() => navigate("/")}>
              Order Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PlaceOrder;
