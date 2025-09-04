import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";

const Cart = ({ showToast }) => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const navigate = useNavigate();

  const deliveryFee = 50; // ₹50 delivery fee
  const subtotal = getTotalCartAmount();
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + deliveryFee - discountAmount;

  const promoCodes = {
    SAVE10: 10,
    WELCOME20: 20,
    FIRST15: 15,
    STUDENT5: 5,
  };

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code] && !isPromoApplied) {
      setDiscount(promoCodes[code]);
      setIsPromoApplied(true);
      showToast(`Promo code applied! ${promoCodes[code]}% discount`, "success");
    } else if (isPromoApplied) {
      showToast("Promo code already applied", "warning");
    } else {
      showToast("Invalid promo code", "error");
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setIsPromoApplied(false);
    setPromoCode("");
    showToast("Promo code removed", "info");
  };

  const handleCheckout = () => {
    if (subtotal === 0) {
      showToast("Your cart is empty", "warning");
      return;
    }
    navigate("/place-order");
  };

  const clearCart = () => {
    // Clear all items from cart
    Object.keys(cartItems).forEach((itemId) => {
      if (cartItems[itemId] > 0) {
        for (let i = 0; i < cartItems[itemId]; i++) {
          removeFromCart(itemId);
        }
      }
    });
    setDiscount(0);
    setIsPromoApplied(false);
    setPromoCode("");
    showToast("Cart cleared", "info");
  };

  const getCartItemsArray = () => {
    return food_list.filter((item) => cartItems[item._id] > 0);
  };

  const cartItemsArray = getCartItemsArray();

  if (cartItemsArray.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart fade-in">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="browse-menu-btn" onClick={() => navigate("/")}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header fade-in">
          <h1>Your Cart</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <div className="header-item">Item</div>
              <div className="header-title">Title</div>
              <div className="header-price">Price</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-total">Total</div>
              <div className="header-remove">Remove</div>
            </div>

            <hr className="cart-divider" />

            <div className="cart-items-list">
              {cartItemsArray.map((item, index) => (
                <div
                  key={item._id}
                  className={`cart-item fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-title">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="cart-item-price">
                    ₹{Math.round(item.price * 75)}
                  </div>
                  <div className="cart-item-quantity">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn decrease"
                        onClick={() => removeFromCart(item._id)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="quantity-value">
                        {cartItems[item._id]}
                      </span>
                      <button
                        className="quantity-btn increase"
                        onClick={() => addToCart(item._id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    ₹{Math.round(item.price * 75 * cartItems[item._id])}
                  </div>
                  <div className="cart-item-remove">
                    <button
                      className="remove-btn"
                      onClick={() => {
                        // Remove all instances of this item
                        for (let i = 0; i < cartItems[item._id]; i++) {
                          removeFromCart(item._id);
                        }
                        showToast(`${item.name} removed from cart`, "info");
                      }}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="cart-totals">
              <h2>Cart Totals</h2>

              <div className="totals-breakdown">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                {discount > 0 && (
                  <div className="total-row discount-row">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{Math.round(discountAmount)}</span>
                  </div>
                )}
                <hr />
                <div className="total-row final-total">
                  <span>Total</span>
                  <span>₹{Math.round(total)}</span>
                </div>
              </div>

              <div className="promo-code-section">
                <h3>Have a promo code?</h3>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isPromoApplied}
                    className={isPromoApplied ? "applied" : ""}
                  />
                  {!isPromoApplied ? (
                    <button
                      className="apply-btn"
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      className="remove-promo-btn"
                      onClick={removePromoCode}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {isPromoApplied && (
                  <div className="promo-success">
                    ✓ Promo code applied successfully!
                  </div>
                )}
                <div className="available-promos">
                  <p>Available codes: SAVE10, WELCOME20, FIRST15, STUDENT5</p>
                </div>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
