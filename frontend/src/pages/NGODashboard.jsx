import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import "./NGODashboard.css"; // Import external CSS
import ChatButton from "./ChatButton";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [ratings, setRatings] = useState({});
  const token = localStorage.getItem("token");
  const ngoEmail = "ngo@example.com"; // Fetch dynamically from auth context

  // Fetch pending donations
  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ngo-donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(response.data);
    } catch (error) {
      alert("Failed to fetch donations. Please try again.");
    }
  };

  // Fetch accepted donations
  const fetchAcceptedDonations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ngo-acceptedDonations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedDonations(response.data);
    } catch (error) {
      alert("Failed to fetch accepted donations.");
    }
  };

  // Update donation status
  const updateDonationStatus = async (donationId, status) => {
    try {
      await axios.post(
        "http://localhost:5000/update-donation",
        {
          donationId,
          status,
          ngoEmail,
          ngoName: "NGO Example",
          ngoContact: "1234567890",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Donation ${status.toLowerCase()} successfully!`);
      fetchDonations();
      fetchAcceptedDonations();
    } catch (error) {
      alert(`Failed to ${status.toLowerCase()} donation. Please try again.`);
    }
  };

  // Rate food quality
  const rateDonation = async (donationId) => {
    const rating = ratings[donationId];
    if (!rating) return alert("Please select a rating");
  
    try {
      console.log("📌 Sending rating request:", { donationId, rating });
  
      const response = await axios.post(
        "http://localhost:5000/rate-donation",
        { donationId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Response from backend:", response.data);
      alert("Rating submitted successfully!");
      fetchAcceptedDonations();
    } catch (error) {
      console.error("❌ Error submitting rating:", error.response?.data || error);
      alert(`Failed to rate donation: ${error.response?.data?.message || "Unknown error"}`);
    }
  };
  

  useEffect(() => {
    fetchDonations();
    fetchAcceptedDonations();
  }, []);

  return (
    <div className="dashboard-container">
      <br />
      <Navbar />
      <ChatButton />
      <br />

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h1 className="dashboard-title">NGO Dashboard</h1>
          
          {/* Pending Donations */}
          <h2 className="section-title">Pending Donations</h2>
          <div className="table-container">
            <table className="donation-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>People Fed</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.donorEmail}</td>
                    <td>{donation.peopleFed}</td>
                    <td>{donation.location}</td>
                    <td>
                      <button
                        onClick={() => updateDonationStatus(donation._id, "Accepted")}
                        className="accept-button"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateDonationStatus(donation._id, "Rejected")}
                        className="reject-button"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accepted Donations - Food Quality Rating */}
          <h2 className="section-title">Accepted Donations</h2>
          <div className="table-container">
            <table className="donation-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>People Fed</th>
                  <th>Location</th>
                  <th>Food Quality</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {acceptedDonations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.donorEmail}</td>
                    <td>{donation.peopleFed}</td>
                    <td>{donation.location}</td>
                    <td>
                      <select
                        value={ratings[donation._id] || ""}
                        onChange={(e) => setRatings({ ...ratings, [donation._id]: e.target.value })}
                      >
                        <option value="">Select</option>
                        <option value="5">Good</option>
                        <option value="3">Partially Bad</option>
                        <option value="1">Bad</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => rateDonation(donation._id)} className="rate-button">
                        Submit Rating
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="iframe-button-container">
        <p className="ml-model-description">
          Upload an image to our AI-powered food recognition tool to identify food items instantly and assist in efficient distribution.
        </p>
        <button 
          className="open-streamlit-btn"
          onClick={() => window.open("http://localhost:8501")}
        >
          Identify Food
        </button>
        
      </div>
      <br />
      <Footer />
      <br />
    </div>
  );
};

export default NGODashboard;
