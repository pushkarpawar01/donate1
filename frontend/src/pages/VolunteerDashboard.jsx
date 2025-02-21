import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VolunteerDashboard.css"; // Import the CSS file
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatButton from "./ChatButton";

const VolunteerDashboard = () => {
  const [ngoEmail, setNgoEmail] = useState("");
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setVolunteerLocation({ latitude, longitude });
        },
        (error) => {
          let errorMessage = "Failed to get your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get your location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred while fetching the location.";
          }
          setError(errorMessage);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchDonations = async () => {
    try {
      navigate("/map");
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/volunteer-acceptedDonations", {
        params: { ngoEmail },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(response.data.donations);
      setError("");
    } catch (err) {
      setError("Failed to fetch donations. Please try again.");
    }
  };

  const handleDeliverDonation = async (donationId) => {
    if (!volunteerLocation) {
      alert("Please wait while we fetch your location.");
      return;
    }

    try {
      navigate("/map", { state: { volunteerLocation } });
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/volunteer-deliver-donation",
        {
          donationId,
          volunteerLocation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      navigate("/map", { state: { volunteerLocation } });
    } catch (err) {
      alert("Failed to deliver the donation. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ngoEmail.trim()) {
      fetchDonations();
    } else {
      setError("Please enter a valid NGO email.");
    }
  };

  return (
    <div className="volunteer-dashboard">
      <Navbar/>
      <ChatButton/>
      <h1 className="dashboard-title">Volunteer Dashboard</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="volunteer-form">
        <div className="form-group">
          <label htmlFor="ngoEmail" className="form-label">NGO Email:</label>
          <input
            id="ngoEmail"
            type="email"
            value={ngoEmail}
            onChange={(e) => setNgoEmail(e.target.value)}
            placeholder="Enter NGO Email"
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-button">
          Search Donations
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Donation List */}
      <div className="donation-list">
        {donations.length === 0 ? (
          <p className="no-donations">No accepted donations found for the provided NGO email.</p>
        ) : (
          donations.map((donation) => (
            <div key={donation._id} className="donation-item">
              <h2 className="donation-title">{donation.location}</h2>
              <p><strong>People Fed:</strong> {donation.peopleFed}</p>
              <p><strong>Contact:</strong> {donation.contact}</p>
              <p><strong>Expiry Date:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>

              {/* Deliver Button */}
              <button
                onClick={() => handleDeliverDonation(donation._id)}
                className="deliver-button"
              >
                Deliver
              </button>
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default VolunteerDashboard;
