import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div>
          {/* Clear All Button */}
          <button
            onClick={handleClearAll}
            className="bg-red-500 text-white p-2 mb-4 rounded"
          >
            Clear All Notifications
          </button>

          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-2 ${notification.isRead ? "bg-gray-100" : "bg-yellow-100"}`}
              >
                {notification.message}
                <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="text-red-500 ml-2"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DonorNotifications;
