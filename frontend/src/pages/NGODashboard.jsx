import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [ngoDetails, setNgoDetails] = useState({});
  const [requestedQuantity, setRequestedQuantity] = useState(""); // Input for food quantity

  const token = localStorage.getItem("token");

  // Fetch NGO profile details dynamically
  const fetchNgoDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNgoDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch NGO details:", error);
    }
  };

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

  // Send a food request with specified quantity
  const requestFood = async () => {
    if (!requestedQuantity || requestedQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/request-food",
        {
          ngoEmail: ngoDetails.email,
          ngoName: ngoDetails.name,
          ngoContact: ngoDetails.contact,
          quantity: requestedQuantity, // Include quantity in the request
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Food request sent successfully!");
      setRequestedQuantity(""); // Reset input after success
    } catch (error) {
      console.error("Failed to send food request:", error);
      alert("Error sending food request. Try again.");
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
          ngoEmail: ngoDetails.email,
          ngoName: ngoDetails.name,
          ngoContact: ngoDetails.contact,
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
    fetchNgoDetails();
    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">NGO Dashboard</h1>

          {/* Request Food Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Request Food</h2>
            <input
              type="number"
              value={requestedQuantity}
              onChange={(e) => setRequestedQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="border p-2 rounded-md w-full"
            />
            <button
              onClick={requestFood}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
            >
              Request Food
            </button>
          </div>

          {/* Pending Donations Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pending Donations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      People Fed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.donorEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.peopleFed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.location}
                      </td>
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
