import React, { useState, useEffect } from 'react';
import { adminAPI, handleApiError } from '../../utils/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="users">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchUsers} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users">
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>View and manage all registered users</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Users ({users.length})</h2>
        </div>
        <div className="card-body">
          {users.length > 0 ? (
            <div className="users-table-container">
              <table className="table users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Cart Items</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div className="user-id">ID: {user._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-email">{user.email}</div>
                      </td>
                      <td>
                        <div className="join-date">
                          {user._id ? formatDate(new Date(parseInt(user._id.substring(0, 8), 16) * 1000)) : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="cart-info">
                          <span className="cart-count">
                            {user.cartData ? Object.keys(user.cartData).length : 0} items
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge active">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">👥</div>
              <h3>No Users Found</h3>
              <p>No users have registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
