import React, { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list_api, setFoodListApi] = useState(food_list); // Initialize with static data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // API Base URL
  const API_BASE_URL = "http://localhost:4000/api";

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch food data from backend
  const fetchFoodList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/food/list`);

      if (response.data.success) {
        // Transform backend data to match frontend format
        const transformedData = response.data.data.map((item) => ({
          _id: item._id,
          name: item.name,
          image: `${API_BASE_URL.replace("/api", "")}/images/${item.image}`,
          price: item.price / 75, // Convert from rupees to dollars for consistency
          description: item.description,
          category: item.category,
        }));

        // Merge static food items with API food items
        const mergedFoodList = [...food_list, ...transformedData];

        // Check for new dishes (only from API, not static)
        if (food_list_api.length > 0) {
          const newDishes = transformedData.filter(
            (newItem) =>
              !food_list_api.some(
                (existingItem) => existingItem._id === newItem._id
              )
          );

          if (newDishes.length > 0) {
            newDishes.forEach((dish) => {
              addNotification(`🍽️ New dish added: ${dish.name}`, "success");
            });
          }
        }

        setFoodListApi(mergedFoodList);
        console.log(
          "✅ Food data updated from backend:",
          transformedData.length,
          "items"
        );
      } else {
        console.warn(
          "⚠️ Backend returned unsuccessful response, using static data only"
        );
        setFoodListApi(food_list); // Keep static data
      }
    } catch (error) {
      console.error("❌ Error fetching food data from backend:", error);
      setError("Failed to load new items from backend");
      setFoodListApi(food_list); // Ensure static data is always available
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchFoodList();
  }, []);

  // Real-time polling for updates (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFoodList();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function for immediate updates
  const refreshFoodData = () => {
    console.log("🔄 Manually refreshing food data...");
    fetchFoodList();
  };

  // Notification functions
  const addNotification = (message, type = "info") => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    const currentFoodList = getCurrentFoodList();

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = currentFoodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * 75 * cartItems[item]; // Convert to rupees
        }
      }
    }
    return totalAmount;
  };

  // Always return merged food list (static + API data)
  const getCurrentFoodList = () => {
    // If we have API data, it already includes static data merged
    if (food_list_api.length > 0) {
      return food_list_api;
    }
    // Fallback to static data only if API fails
    return food_list;
  };

  const contextValue = {
    food_list: getCurrentFoodList(),
    food_list_api,
    loading,
    error,
    notifications,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    refreshFoodData,
    fetchFoodList,
    addNotification,
    removeNotification,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
