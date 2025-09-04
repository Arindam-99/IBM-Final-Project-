import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI, getImageUrl, handleApiError } from '../../utils/api';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAll();
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        setError('Failed to fetch restaurants');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await restaurantAPI.delete(id);
      if (response.data.success) {
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
        alert('Restaurant deleted successfully!');
      } else {
        alert('Failed to delete restaurant');
      }
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="restaurants">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurants">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchRestaurants} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurants">
      <div className="page-header">
        <div className="header-content">
          <h1>Restaurant Management</h1>
          <p>Manage all restaurants in your delivery network</p>
        </div>
        <Link to="/add-restaurant" className="btn btn-primary">
          🏢 Add New Restaurant
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Restaurants ({restaurants.length})</h2>
        </div>
        <div className="card-body">
          {restaurants.length > 0 ? (
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="restaurant-card">
                  <div className="restaurant-image">
                    <img 
                      src={getImageUrl(restaurant.image)} 
                      alt={restaurant.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="restaurant-status">
                      <span className={`status-badge ${restaurant.isActive ? 'active' : 'inactive'}`}>
                        {restaurant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="restaurant-content">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                    <div className="restaurant-info">
                      <div className="info-item">
                        <span className="info-icon">⭐</span>
                        <span>{restaurant.rating}/5</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">🕒</span>
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                    {restaurant.badge && (
                      <div className="restaurant-badge">{restaurant.badge}</div>
                    )}
                    {restaurant.discount && (
                      <div className="restaurant-discount">{restaurant.discount}</div>
                    )}
                    <div className="restaurant-contact">
                      <p>📍 {restaurant.address}</p>
                      <p>📞 {restaurant.phone}</p>
                      <p>✉️ {restaurant.email}</p>
                    </div>
                  </div>
                  
                  <div className="restaurant-actions">
                    <Link 
                      to={`/edit-restaurant/${restaurant._id}`} 
                      className="btn btn-sm btn-warning"
                    >
                      ✏️ Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(restaurant._id, restaurant.name)}
                      className="btn btn-sm btn-danger"
                      disabled={deleteLoading === restaurant._id}
                    >
                      {deleteLoading === restaurant._id ? '⏳' : '🗑️'} Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">🏪</div>
              <h3>No Restaurants Found</h3>
              <p>Start by adding your first restaurant to the network.</p>
              <Link to="/add-restaurant" className="btn btn-primary">
                Add First Restaurant
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
