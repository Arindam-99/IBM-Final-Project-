import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI, getImageUrl, handleApiError } from "../../utils/api";
import "./AddFood.css";

const AddFood = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Pizza",
    "Burgers",
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Thai",
    "Japanese",
    "Desserts",
    "Beverages",
    "Salads",
    "Sandwiches",
  ];

  useEffect(() => {
    if (isEdit) {
      fetchFoodItem();
    }
  }, [id, isEdit]);

  const fetchFoodItem = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFoodById(id);
      if (response.data.success) {
        const food = response.data.data;
        setFormData({
          name: food.name,
          description: food.description,
          price: food.price.toString(),
          category: food.category,
          image: null,
        });
        setImagePreview(getImageUrl(food.image));
      } else {
        setError("Failed to fetch food item");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Food name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Valid price is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    if (!isEdit && !formData.image) {
      setError("Image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      let response;
      if (isEdit) {
        response = await adminAPI.updateFood(id, submitData);
      } else {
        response = await adminAPI.addFood(submitData);
      }

      if (response.data.success) {
        setSuccess(
          `Food item ${
            isEdit ? "updated" : "added"
          } successfully! 🎉 Changes will appear on the main website within 10 seconds.`
        );
        setTimeout(() => {
          navigate("/food-items");
        }, 2000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${isEdit ? "update" : "add"} food item`
        );
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-food">
      <div className="page-header">
        <h1>{isEdit ? "Edit Food Item" : "Add New Food Item"}</h1>
        <p>
          {isEdit
            ? "Update the food item details"
            : "Add a new food item to your menu"}
        </p>
      </div>

      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h2>{isEdit ? "Edit Food Details" : "Food Details"}</h2>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="food-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Food Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter food name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter food description"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Food Image {!isEdit && "*"}
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="form-control"
                    accept="image/*"
                    {...(!isEdit && { required: true })}
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <label className="form-label">Image Preview</label>
                  <div className="preview-container">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate("/food-items")}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>{" "}
                      {isEdit ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={
                          isEdit ? "fas fa-edit" : "fas fa-plus-circle"
                        }
                      ></i>
                      {isEdit ? " Update Food Item" : " Add Food Item"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
