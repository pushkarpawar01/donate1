import React, { useState, useEffect } from "react";
import axios from "axios";

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

        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations", error);
      }
    };
    fetchDonations();
  }, []);

  const handleTrack = (donationId) => {
    // Implement the logic to track the donation (for example, open a map or detailed page)
    console.log("Tracking donation:", donationId);
  };

  const handleDonateAgain = (donation) => {
    // Pre-fill the donation form with the existing data and allow the donor to donate again
    console.log("Donate again with details:", donation);
    // Redirect to the donor dashboard to pre-fill the donation form (if needed)
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Donations</h1>

      {donations.length === 0 ? (
        <p>No accepted donations yet.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id} className="p-4 border-b">
              <h2 className="text-xl font-semibold">{donation.location}</h2>
              <p><strong>People Fed:</strong> {donation.peopleFed}</p>
              <p><strong>Contact:</strong> {donation.contact}</p>
              <p><strong>Expiry Date:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleTrack(donation._id)}
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Track
                </button>
                <button
                  onClick={() => handleDonateAgain(donation)}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Donate Again
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDonations;
