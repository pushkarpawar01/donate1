import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NGODonations.css"; // Import CSS file
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const NGODonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/ngo-acceptedDonations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleRating = async (donationId, rating) => {
    try {
      setRatings((prevRatings) => ({
        ...prevRatings,
        [donationId]: rating,
      }));

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/update-donation-rating",
        { donationId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      alert("Failed to update rating. Please try again.");
    }
  };

  return (
    <div>
<br />
<Navbar/>
{/* <br /> */}
    <div className="ngo-donations-container">
      
      <h1 className="title">Accepted Donations</h1>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : donations.length === 0 ? (
        <p className="no-donations-text">No accepted donations found.</p>
      ) : (
        <ul className="donations-list">
          {donations.map((donation) => (
            <li key={donation._id} className="donation-card">
              <h3 className="donor-email">{donation.donorEmail}</h3>
              <p><strong>People Fed:</strong> {donation.peopleFed}</p>
              <p><strong>Location:</strong> {donation.location}</p>
              <p><strong>Expiry Date:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>

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
              </div>
            </li>
          ))}
        </ul>
      )}
      <Footer/>
    </div>
    </div>
  );
};

export default NGODonations;
