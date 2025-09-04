import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import SearchResults from "./pages/SearchResults/SearchResults";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Toast from "./components/Toast/Toast";
import ToastContainer from "./components/ToastContainer/ToastContainer";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <ThemeProvider>
      <div className="app">
        {showLogin && (
          <LoginPopup setShowLogin={setShowLogin} showToast={showToast} />
        )}
        <Navbar setShowLogin={setShowLogin} showToast={showToast} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart showToast={showToast} />} />
            <Route
              path="/place-order"
              element={<PlaceOrder showToast={showToast} />}
            />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
        <Footer />
        {toastMessage && <Toast message={toastMessage} type={toastType} />}
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
};

export default App;
