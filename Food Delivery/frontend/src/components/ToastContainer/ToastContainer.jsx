import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import Toast from '../Toast/Toast';
import './ToastContainer.css';

const ToastContainer = () => {
  const { notifications, removeNotification } = useContext(StoreContext);

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
