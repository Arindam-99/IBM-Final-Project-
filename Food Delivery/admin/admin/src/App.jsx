import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import FoodItems from "./pages/FoodItems/FoodItems";
import AddFood from "./pages/AddFood/AddFood";
import Restaurants from "./pages/Restaurants/Restaurants";
import AddRestaurant from "./pages/AddRestaurant/AddRestaurant";
import Users from "./pages/Users/Users";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/food-items" element={<FoodItems />} />
              <Route path="/add-food" element={<AddFood />} />
              <Route path="/edit-food/:id" element={<AddFood />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/add-restaurant" element={<AddRestaurant />} />
              <Route path="/edit-restaurant/:id" element={<AddRestaurant />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
