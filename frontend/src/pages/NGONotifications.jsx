import React, { useState, useEffect } from 'react';
import './NGONotifications.css'; // For styling

const NGONotifications = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000); // Automatically close after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`ngo-notification ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={() => setVisible(false)}>X</button>
    </div>
  );
};

export default NGONotifications;
