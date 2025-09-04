import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI, handleApiError } from "../../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    foodsByCategory: [],
    recentFoods: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError("Failed to fetch dashboard stats");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchDashboardStats} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your food delivery admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalFoods}</h3>
            <p>Total Food Items</p>
          </div>
          <Link to="/food-items" className="stat-link">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <Link to="/users" className="stat-link">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.foodsByCategory.length}</h3>
            <p>Categories</p>
          </div>
          <Link to="/food-items" className="stat-link">
            Manage <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-server"></i>
          </div>
          <div className="stat-content">
            <h3>Active</h3>
            <p>System Status</p>
          </div>
          <span className="stat-link status-active">
            <i className="fas fa-circle"></i> Online
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="action-buttons">
              <Link to="/add-food" className="btn btn-primary">
                <i className="fas fa-plus-circle"></i> Add New Food Item
              </Link>
              <Link to="/add-restaurant" className="btn btn-success">
                <i className="fas fa-building"></i> Add New Restaurant
              </Link>
              <Link to="/food-items" className="btn btn-warning">
                <i className="fas fa-edit"></i> Manage Food Items
              </Link>
              <Link to="/restaurants" className="btn btn-secondary">
                <i className="fas fa-store"></i> Manage Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-content">
        <div className="recent-foods">
          <div className="card">
            <div className="card-header">
              <h2>Recent Food Items</h2>
            </div>
            <div className="card-body">
              {stats.recentFoods.length > 0 ? (
                <div className="recent-list">
                  {stats.recentFoods.map((food) => (
                    <div key={food._id} className="recent-item">
                      <div className="item-info">
                        <h4>{food.name}</h4>
                        <p>
                          {food.category} • ₹{food.price}
                        </p>
                      </div>
                      <div className="item-actions">
                        <Link
                          to={`/edit-food/${food._id}`}
                          className="btn btn-sm btn-warning"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">
                  No food items found.{" "}
                  <Link to="/add-food">Add your first food item</Link>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="category-stats">
          <div className="card">
            <div className="card-header">
              <h2>Food Categories</h2>
            </div>
            <div className="card-body">
              {stats.foodsByCategory.length > 0 ? (
                <div className="category-list">
                  {stats.foodsByCategory.map((category, index) => (
                    <div key={index} className="category-item">
                      <span className="category-name">{category._id}</span>
                      <span className="category-count">
                        {category.count} items
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No categories found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
