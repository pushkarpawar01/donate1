import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyDonations.css"; // Importing the CSS file
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedDonations = response.data.sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));

        setDonations(sortedDonations);
      } catch (error) {
        console.error("Error fetching donations", error);
      }
    };
    fetchDonations();
  }, []);

  const handleTrack = (donationId) => {
    console.log("Tracking donation:", donationId);
    window.location.href = `/track-donation/${donationId}`;
  };

  const handleDonateAgain = (donation) => {
    console.log("Donate again with details:", donation);
  };

  return (
    <div className="my-donations-container">
      <Navbar/>
      <br />
      <br />
      <br />
      <h1 className="title">My Donations</h1>

      {donations.length === 0 ? (
        <p className="no-donations-text">No accepted donations yet.</p>
      ) : (
        <ul className="donation-list">
          {donations.map((donation) => (
            <li key={donation._id} className="donation-item">
              <h2 className="donation-location">{donation.location}</h2>
              <p><strong>People Fed:</strong> {donation.peopleFed}</p>
              <p><strong>Contact:</strong> {donation.contact}</p>
              <p><strong>Expiry Date:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>

              <div className="rating-container">
                <p><strong>Rating:</strong></p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${donation.rating >= star ? "rated" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="donation-actions">
                <button
                  onClick={() => handleTrack(donation._id)}
                  className="btn track-btn"
                >
                  Track
                </button>
                <button
                  onClick={() => handleDonateAgain(donation)}
                  className="btn donate-again-btn"
                >
                  Donate Again
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Footer/>
    </div>
  );
};

export default MyDonations;
