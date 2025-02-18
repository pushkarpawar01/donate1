import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);

  // Fetch pending donations
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/ngo-donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(response.data);
    } catch (error) {
      alert("Failed to fetch donations. Please try again.");
    }
  };

  // Update the donation status (Accept/Reject)
  const updateDonationStatus = async (donationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/update-donation",
        { donationId, status, ngoName: "NGO Example", ngoEmail: "ngo@example.com", ngoContact: "1234567890" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Donation updated successfully!");
      fetchDonations();
    } catch (error) {
      alert("Failed to update donation. Please try again.");
    }
  };

  // Handle Request Food button click
  const handleRequestFood = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/request-food",
        {
          ngoName: "NGO Example",
          ngoEmail: "ngo@example.com",
          ngoContact: "1234567890",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Food request sent to all donors!");
    } catch (error) {
      alert("Failed to send food request. Please try again.");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>
        
        {/* Request Food Button */}
        <button
          onClick={handleRequestFood}
          className="bg-orange-500 text-white px-4 py-2 rounded mb-4"
        >
          Request Food
        </button>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Donor Email</th>
              <th className="border px-4 py-2">People Fed</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td className="border px-4 py-2">{donation.donorEmail}</td>
                <td className="border px-4 py-2">{donation.peopleFed}</td>
                <td className="border px-4 py-2">{donation.location}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => updateDonationStatus(donation._id, "Accepted")}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateDonationStatus(donation._id, "Rejected")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
};

export default NGODashboard;
