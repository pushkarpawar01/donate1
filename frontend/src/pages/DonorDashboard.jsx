import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DonorDashboard.css";  
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
    description: "", // Add description to the state
    coordinates: [],  // Store coordinates here
  });

  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!donation.donorEmail || !emailRegex.test(donation.donorEmail)) {
      newErrors.donorEmail = "Enter a valid email address.";
    }

    if (!donation.peopleFed || parseInt(donation.peopleFed) <= 0) {
      newErrors.peopleFed = "Must be at least 1 person.";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!donation.contact || !phoneRegex.test(donation.contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits.";
    }

    if (!donation.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
    }

    if (!donation.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!donation.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCoordinatesFromLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyC1-bVbHAWMsKiXcOJ7FKs_e2ERVkhfpYQ`
      );
      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return [lng, lat]; // [longitude, latitude]
      }
      throw new Error("Invalid location");
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve([longitude, latitude]); // [longitude, latitude]
          },
          (error) => {
            reject("Error getting location");
          }
        );
      } else {
        reject("Geolocation not available");
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
  
    let coordinates = null;
  
    // If location is entered, use geocoding API to get coordinates
    if (donation.location.trim()) {
      coordinates = await getCoordinatesFromLocation(donation.location);
    }
  
    // If no valid location entered or geocoding fails, use current location
    if (!coordinates) {
      try {
        coordinates = await getCurrentLocation();
      } catch (error) {
        alert("Could not determine location.");
        return;
      }
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const updatedDonation = { 
        ...donation,
        coordinates,  // Store the coordinates
        description: donation.description, // Ensure description is passed
      };
  
      await axios.post("http://localhost:5000/donate", updatedDonation, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Donation submitted successfully!");
      setDonation({ donorEmail: "", peopleFed: "", contact: "", expiryDate: "", location: "", description: "", coordinates: [] });
      setErrors({});
    } catch (error) {
      alert("Failed to submit donation. Please try again.");
    }
  };
  

  return (
    <div className="donor-dashboard-container">
      <Navbar />
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
            {errors.donorEmail && <p className="error-text">{errors.donorEmail}</p>}
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
            {errors.peopleFed && <p className="error-text">{errors.peopleFed}</p>}
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
            {errors.contact && <p className="error-text">{errors.contact}</p>}
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
            {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Enter Your Location"
              value={donation.location}
              onChange={handleInputChange}
              className="input-field"
            />
            {errors.location && <p className="error-text">{errors.location}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Enter a description of the donation"
              value={donation.description}
              onChange={handleInputChange}
              className="input-field"
            />
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>
        </div>

        <button onClick={handleSubmit} className="submit-button">
          Submit Donation
        </button>
      </div>
      <ChatButton />
      <Footer />
    </div>
  );
};

export default DonorDashboard;
