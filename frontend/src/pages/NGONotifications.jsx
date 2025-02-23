import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import "./NGONotifications.css";

const NGONotifications = ({ ngoEmail }) => {
  const [notifications, setNotifications] = useState([
    { message: "Welcome to EN-4! Start making an impact today." },
    { message: "A new donation request has been added in your area." },
    { message: "A volunteer is on the way to pick up the donation." },
    { message: "A volunteer is arriving soon to deliver the food." },
    { message: "The food package has been successfully picked up." },
    { message: "The donation is currently in transit." },
    { message: "The donation has been successfully delivered." },
  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/notifications/${ngoEmail}`
        );
        setNotifications((prev) => [...prev, ...response.data]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (ngoEmail) {
      fetchNotifications();
    }
  }, [ngoEmail]);

  const handleDismiss = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="notification-container" style={{ width: "100%", maxWidth: "100%" }}>
        <br />
        {notifications.length === 0 ? (
          <p className="no-notifications">No new notifications</p>
        ) : (
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                className="ngo-notification"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              >
                <span>{notification.message}</span>
                <button className="dismiss-btn" onClick={() => handleDismiss(index)}>
                  ✖
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <Footer />
    </>
  );
};

export default NGONotifications;
