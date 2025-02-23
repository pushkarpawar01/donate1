import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VolunteerForm.css";
import Navbar from "../components/Navbar";

const VolunteerForm = () => {
  const [volunteer, setVolunteer] = useState({ name: "", email: "" });
  const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission

  const handleChange = (e) => {
    setVolunteer({ ...volunteer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await axios.post("http://localhost:5000/api/volunteers/register", volunteer);
      toast.success("Form submitted successfully!");
      setFormSubmitted(true); // Show WhatsApp button after submission
    } catch (error) {
      toast.error("Registration failed!");
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <motion.div
        className="volunteer-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2>Join as a Volunteer</h2>
        <p className="volunteer-info">
          Become a part of our mission to reduce food waste and help those in need! Register below
          and unlock access to our exclusive volunteer WhatsApp group. 🚀
        </p>

        {!formSubmitted ? (
          <form onSubmit={handleSubmit}>
            <motion.input
              type="text"
              name="name"
              placeholder="Your Name"
              value={volunteer.name}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
            />
            <motion.input
              type="email"
              name="email"
              placeholder="Your Email"
              value={volunteer.email}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.05, borderColor: "#28a745" }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register
            </motion.button>
          </form>
        ) : (
          <>
            <p className="success-message">✅ Registration successful! You can now join our WhatsApp group.</p>
            <a href="https://chat.whatsapp.com/HSOOU37M99fBh848dyBD5u" target="_blank" rel="noopener noreferrer">
              <motion.button className="whatsapp-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Join WhatsApp Group
              </motion.button>
            </a>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VolunteerForm;
