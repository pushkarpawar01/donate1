import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem("token");
  const ngoEmail = "ngo@example.com"; // You should get this from your auth context or user profile

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
          ngoName: "NGO Example", // Should come from user profile
          ngoContact: "1234567890" // Should come from user profile
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">NGO Dashboard</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pending Donations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People Fed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{donation.donorEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{donation.peopleFed}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{donation.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => updateDonationStatus(donation._id, "Accepted")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateDonationStatus(donation._id, "Rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
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
      </div>
      <Footer />
    </div>
  );
};

export default NGODashboard;
