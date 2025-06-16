import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NGODonations.css"; // Import CSS file
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Circles } from "react-loader-spinner"; // Import Loader Spinner

const NGODonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState(""); // Handle errors

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/ngo-acceptedDonations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonations(response.data);
        setError(""); // Clear previous errors if successful

        // Load ratings from localStorage or backend
        const storedRatings = JSON.parse(localStorage.getItem("ngoRatings")) || {};
        const initialRatings = {};

        response.data.forEach((donation) => {
          initialRatings[donation._id] = storedRatings[donation._id] || donation.rating || 0;
        });

        setRatings(initialRatings);
      } catch (error) {
        console.error("Error fetching donations", error);
        setError("Failed to load accepted donations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Function to update ratings with confirmation
  const handleRating = async (donationId, rating) => {
    const confirmAction = window.confirm(`Are you sure you want to rate this ${rating} stars?`);
    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/rate-donation",
        { donationId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state and localStorage
      const newRatings = { ...ratings, [donationId]: rating };
      setRatings(newRatings);
      localStorage.setItem("ngoRatings", JSON.stringify(newRatings));

      alert("Rating updated successfully!");
    } catch (error) {
      alert("Failed to update rating. Please try again.");
    }
  };

  return (
    <div>
      <br />
      <Navbar />
      <br />
      {/* <br /> */}
      
      <div className="ngo-donations-container">
        <h1 className="title">Accepted Donations</h1>

        {/* Display error message if an error occurs */}
        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <div className="loading-container">
            <Circles height="50" width="50" color="#007bff" />
            <p>Loading...</p>
          </div>
        ) : donations.length === 0 ? (
          <p className="no-donations-text">No accepted donations found.</p>
        ) : (
          <ul className="donations-list">
            {donations.map((donation) => (
              <li key={donation._id} className="donation-card">
                <h3 className="donor-email">{donation.donorEmail}</h3>
                <p><strong>Contact:</strong> {donation.contact}</p>
                <p><strong>People Fed:</strong> {donation.peopleFed}</p>
                <p><strong>Location:</strong> {donation.location}</p>
                <p>
                  <strong>Expiry Date:</strong> {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : "N/A"}
                </p>

                {/* Rating Section */}
                <div className="rating-section">
                  <p>Rate this donation:</p>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(donation._id, star)}
                        className={`star-button ${ratings[donation._id] >= star ? "selected" : ""}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p>Given Rating: {ratings[donation._id] || "Not rated yet"} ⭐</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default NGODonations;
