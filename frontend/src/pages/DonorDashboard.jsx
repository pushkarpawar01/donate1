import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DonorDashboard.css";  // Importing the CSS file
import Donate from "./Donate";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatButton from "./ChatButton";

const DonorDashboard = () => {
  const [donation, setDonation] = useState({
    donorEmail: "",
    peopleFed: "",
    contact: "",
    expiryDate: "",
    location: "",
  });

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

  const handleInputChange = (e) => {
    setDonation({ ...donation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch location dynamically before submitting
      if (!("geolocation" in navigator)) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const updatedDonation = {
            ...donation,
            location: `${latitude}, ${longitude}`, // Store coordinates as a string
          };

          await axios.post("http://localhost:5000/donate", updatedDonation, {
            headers: { Authorization: `Bearer ${token}` },
          });

          alert("Donation submitted successfully!");
          setDonation({ donorEmail: "", peopleFed: "", contact: "", expiryDate: "", location: "" });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to fetch location. Please enable location services.");
        }
      );
    } catch (error) {
      alert("Failed to submit donation. Please try again.");
    }
  };

  return (
    <div className="donor-dashboard-container">
      <Navbar/>
      <br />
      <br />
      <br />
      <br />
      <div className="donor-dashboard-form">
        <h1 className="title">Donor Dashboard</h1>

        {/* Donation Form */}
        <div className="donation-form">
          <div className="form-group">
            <label htmlFor="donorEmail" className="form-label">Donor Email</label>
            <input
              type="email"
              name="donorEmail"
              id="donorEmail"
              placeholder="Enter Donor Email"
              value={donation.donorEmail}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="peopleFed" className="form-label">People Fed</label>
            <input
              type="number"
              name="peopleFed"
              id="peopleFed"
              placeholder="Enter Number of People Fed"
              value={donation.peopleFed}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact" className="form-label">Contact</label>
            <input
              type="text"
              name="contact"
              id="contact"
              placeholder="Enter Contact Number"
              value={donation.contact}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              id="expiryDate"
              value={donation.expiryDate}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Location will be auto-filled"
              // value={donation.location}
              // onChange={handleInputChange}
              className="input-field"
              //disabled
            />
          </div>
        </div>
        
        <button onClick={handleSubmit} className="submit-button">
          Submit Donation
        </button>
      </div>
      <ChatButton/>
      <Footer/>
    </div>
  );
};

export default DonorDashboard;
