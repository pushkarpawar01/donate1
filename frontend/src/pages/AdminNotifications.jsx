import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminNotifications.css'; // Ensure this CSS file is included

const AdminNotifications = () => {
  const location = useLocation();
  const defaultNotifications = [
    { id: 1, message: "NGO 'Helping Hands' has been approved.", type: "success" },
    { id: 2, message: "NGO 'Food for All' has been approved.", type: "success" },
    { id: 3, message: "NGO 'Care Givers' has been declined.", type: "error" },
    { id: 4, message: "NGO 'Green Planet' has been approved.", type: "success" },
    { id: 5, message: "NGO 'Save the Earth' has been declined.", type: "error" },
    { id: 6, message: "NGO 'Hope Foundation' has been approved.", type: "success" },
    { id: 7, message: "NGO 'Future Generations' has been declined.", type: "error" },
    { id: 8, message: "NGO 'Bright Minds' has been approved.", type: "success" },
    { id: 9, message: "NGO 'Shelter Aid' has been declined.", type: "error" },
  ];

  const [notifications, setNotifications] = useState(location.state?.notifications || defaultNotifications);

  // Function to remove notification
  const handleRemoveNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div>
      <Navbar />
      <br /><br /><br /><br />
      <div className="notification-container">
        <h2>Admin Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <ul>
            <AnimatePresence>
              {notifications.map((notif) => (
                <motion.li 
                  key={notif.id} 
                  className={`notification ${notif.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {notif.message}
                  <button className="close-btn" onClick={() => handleRemoveNotification(notif.id)}>✖</button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminNotifications;
