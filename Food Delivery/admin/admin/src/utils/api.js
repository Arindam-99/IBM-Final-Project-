import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API calls
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Food Items
  getAllFoods: (page = 1, limit = 10) => api.get(`/admin/foods?page=${page}&limit=${limit}`),
  getFoodById: (id) => api.get(`/admin/foods/${id}`),
  addFood: (formData) => {
    return axios.post(`${BASE_URL}/admin/foods/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateFood: (id, formData) => {
    return axios.put(`${BASE_URL}/admin/foods/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFood: (id) => api.delete('/admin/foods/remove', { data: { id } }),
  
  // Users
  getAllUsers: () => api.get('/admin/users'),
};

// Restaurant API calls
export const restaurantAPI = {
  getAll: () => api.get('/restaurant/list'),
  getById: (id) => api.get(`/restaurant/${id}`),
  add: (formData) => {
    return axios.post(`${BASE_URL}/restaurant/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, formData) => {
    return axios.put(`${BASE_URL}/restaurant/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.post('/restaurant/remove', { id }),
};

// Food API calls (for main website)
export const foodAPI = {
  getAll: () => api.get('/food/list'),
  add: (formData) => {
    return axios.post(`${BASE_URL}/food/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.post('/food/remove', { id }),
};

// User API calls
export const userAPI = {
  register: (userData) => api.post('/user/register', userData),
  login: (userData) => api.post('/user/login', userData),
};

// Helper function to get image URL
export const getImageUrl = (imageName) => {
  if (!imageName || imageName === 'default-food.jpg' || imageName === 'default-restaurant.jpg') {
    return '/placeholder-image.jpg';
  }
  return `${BASE_URL.replace('/api', '')}/images/${imageName}`;
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default api;
