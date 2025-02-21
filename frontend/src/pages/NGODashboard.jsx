import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import "./NGODashboard.css"; // Import external CSS

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
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
    } catch (error) {
      alert(`Failed to ${status.toLowerCase()} donation. Please try again.`);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="dashboard-container">
      <br />
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h1 className="dashboard-title">NGO Dashboard</h1>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NGODashboard;
