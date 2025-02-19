import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DonorNotifications.css"; // Importing the CSS file
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DonorNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/donor-notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle clear all notifications
  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("http://localhost:5000/clear-all-notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data); // Debugging
      setNotifications([]); // Clear notifications in UI
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  // Handle delete individual notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("http://localhost:5000/delete-notification", {
        headers: { Authorization: `Bearer ${token}` },
        data: { notificationId },
      });
      console.log(response.data); // Debugging
      // Remove notification from UI after deleting
      setNotifications(notifications.filter((notification) => notification._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notifications-container">
      <Navbar/>
      <h1 className="title">Your Notifications</h1>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        <div>
          {/* Clear All Button */}
          <button onClick={handleClearAll} className="clear-all-btn">
            Clear All Notifications
          </button>

          <ul className="notification-list">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`notification-item ${notification.isRead ? "read" : "unread"}`}
              >
                <span>{notification.message}</span>
                <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="delete-btn"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default DonorNotifications;
