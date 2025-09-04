import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantAPI, getImageUrl, handleApiError } from '../../utils/api';
import './AddRestaurant.css';

const AddRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    rating: '',
    deliveryTime: '',
    address: '',
    phone: '',
    email: '',
    badge: '',
    discount: '',
    isActive: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cuisineTypes = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 
    'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Multi-Cuisine'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchRestaurant();
    }
  }, [id, isEdit]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getById(id);
      if (response.data.success) {
        const restaurant = response.data.data;
        setFormData({
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating.toString(),
          deliveryTime: restaurant.deliveryTime,
          address: restaurant.address,
          phone: restaurant.phone,
          email: restaurant.email,
          badge: restaurant.badge || '',
          discount: restaurant.discount || '',
          isActive: restaurant.isActive,
          image: null
        });
        setImagePreview(getImageUrl(restaurant.image));
      } else {
        setError('Failed to fetch restaurant');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Restaurant name is required');
      return false;
    }
    if (!formData.cuisine) {
      setError('Cuisine type is required');
      return false;
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setError('Rating must be between 1 and 5');
      return false;
    }
    if (!formData.deliveryTime.trim()) {
      setError('Delivery time is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!isEdit && !formData.image) {
      setError('Image is required');
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
      setError('');
      setSuccess('');

      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('cuisine', formData.cuisine);
      submitData.append('rating', formData.rating);
      submitData.append('deliveryTime', formData.deliveryTime.trim());
      submitData.append('address', formData.address.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('badge', formData.badge.trim());
      submitData.append('discount', formData.discount.trim());
      submitData.append('isActive', formData.isActive);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let response;
      if (isEdit) {
        response = await restaurantAPI.update(id, submitData);
      } else {
        response = await restaurantAPI.add(submitData);
      }

      if (response.data.success) {
        setSuccess(`Restaurant ${isEdit ? 'updated' : 'added'} successfully!`);
        setTimeout(() => {
          navigate('/restaurants');
        }, 1500);
      } else {
        setError(response.data.message || `Failed to ${isEdit ? 'update' : 'add'} restaurant`);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-restaurant">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Restaurant' : 'Add New Restaurant'}</h1>
        <p>{isEdit ? 'Update the restaurant details' : 'Add a new restaurant to your network'}</p>
      </div>

      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h2>{isEdit ? 'Edit Restaurant Details' : 'Restaurant Details'}</h2>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="restaurant-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Restaurant Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cuisine Type *</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Cuisine</option>
                    {cuisineTypes.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rating (1-5) *</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter rating"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Time *</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., 30-45 mins"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter complete address"
                  rows="2"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Badge (Optional)</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., Popular, New, Featured"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (Optional)</label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., 20% OFF, Free Delivery"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Restaurant Image {!isEdit && '*'}
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="form-control"
                    accept="image/*"
                    {...(!isEdit && { required: true })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Restaurant is Active
                    </label>
                  </div>
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
                  onClick={() => navigate('/restaurants')}
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
                    <>⏳ {isEdit ? 'Updating...' : 'Adding...'}</>
                  ) : (
                    <>{isEdit ? '✏️ Update Restaurant' : '🏢 Add Restaurant'}</>
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

export default AddRestaurant;
