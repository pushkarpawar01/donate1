import React, { useState, useEffect } from "react";
import "./NGONotifications.css"; // For styling

const NGONotifications = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000); // Automatically close after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    if (onClose && typeof onClose === "function") {
      onClose(); // Ensure onClose is a valid function before calling
    }
  };

  if (!visible) return null;

  return (
    <div className={`ngo-notification ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={handleClose}>X</button>
    </div>
  );
};

export default NGONotifications;
