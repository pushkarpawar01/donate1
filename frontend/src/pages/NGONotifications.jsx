import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NGONotifications.css";

const NGONotifications = ({ ngoEmail }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/notifications/${ngoEmail}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [ngoEmail]);

  return (
    <div className="notification-container">
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="ngo-notification">
            <span>{notification.message}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default NGONotifications;
