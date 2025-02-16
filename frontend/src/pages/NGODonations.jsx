import React, { useState, useEffect } from "react";
import axios from "axios";

const NGODonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  // Fetch the accepted donations for the logged-in NGO
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/ngo-donations", {
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

  // Handle rating submission
  const handleRating = async (donationId, rating) => {
    try {
      // Make a request to the backend to update the rating for this donation
      await axios.post(
        "http://localhost:5000/rate-donation",
        { donationId, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the state with the new rating
      setRatings((prevRatings) => ({
        ...prevRatings,
        [donationId]: rating,
      }));
    } catch (error) {
      console.error("Error submitting rating", error);
    }
  };

  return (
    <div>
      <h1>Accepted Donations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : donations.length === 0 ? (
        <p>No accepted donations found.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <h3>{donation.donorEmail}</h3>
              <p>People Fed: {donation.peopleFed}</p>
              <p>Location: {donation.location}</p>
              <p>Expiry Date: {new Date(donation.expiryDate).toLocaleDateString()}</p>

              {/* Rating Section */}
              <div>
                <p>Rate this donation:</p>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(donation._id, star)}
                      style={{
                        color: ratings[donation._id] >= star ? "gold" : "gray",
                      }}
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
    </div>
  );
};

export default NGODonations;
