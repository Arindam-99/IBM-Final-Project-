import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI, getImageUrl, handleApiError } from "../../utils/api";
import "./FoodItems.css";

const FoodItems = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllFoods(1, 50); // Get more items for admin
      if (response.data.success) {
        setFoods(response.data.data.foods);
      } else {
        setError("Failed to fetch food items");
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
      const response = await adminAPI.deleteFood(id);
      if (response.data.success) {
        setFoods(foods.filter((food) => food._id !== id));
        alert(
          "Food item deleted successfully! 🗑️ Changes will appear on the main website within 10 seconds."
        );
      } else {
        alert("Failed to delete food item");
      }
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="food-items">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading food items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="food-items">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchFoods} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="food-items">
      <div className="page-header">
        <div className="header-content">
          <h1>Food Items Management</h1>
          <p>Manage all food items in your delivery system</p>
        </div>
        <Link to="/add-food" className="btn btn-primary">
          <i className="fas fa-plus-circle"></i> Add New Food Item
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Food Items ({foods.length})</h2>
        </div>
        <div className="card-body">
          {foods.length > 0 ? (
            <div className="food-grid">
              {foods.map((food) => (
                <div key={food._id} className="food-card">
                  <div className="food-image">
                    <img
                      src={getImageUrl(food.image)}
                      alt={food.name}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="food-category">{food.category}</div>
                  </div>

                  <div className="food-content">
                    <h3 className="food-name">{food.name}</h3>
                    <p className="food-description">{food.description}</p>
                    <div className="food-price">₹{food.price}</div>
                  </div>

                  <div className="food-actions">
                    <Link
                      to={`/edit-food/${food._id}`}
                      className="btn btn-sm btn-warning"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(food._id, food.name)}
                      className="btn btn-sm btn-danger"
                      disabled={deleteLoading === food._id}
                    >
                      {deleteLoading === food._id ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Deleting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-trash"></i> Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>No Food Items Found</h3>
              <p>Start by adding your first food item to the menu.</p>
              <Link to="/add-food" className="btn btn-primary">
                <i className="fas fa-plus-circle"></i> Add First Food Item
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItems;
