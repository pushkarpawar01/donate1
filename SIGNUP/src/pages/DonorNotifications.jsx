import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DonorNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for the donor
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/donor-notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Donor Notifications</h1>
        
        {/* Display Notifications */}
        <div>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification._id} className={`p-2 ${notification.isRead ? "bg-gray-100" : "bg-yellow-100"}`}>
                  {notification.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorNotifications;
