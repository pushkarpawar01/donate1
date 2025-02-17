import React, { useState } from "react";
import axios from "axios";

const VolunteerDashboard = () => {
  const [ngoEmail, setNgoEmail] = useState("");
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  const fetchDonations = async (page = 1) => {
    try {
      setLoading(true); // Set loading to true while fetching
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.get("http://localhost:5000/volunteer-acceptedDonations", {
        params: { ngoEmail, page }, // Send NGO email and page as query parameters
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setDonations(response.data.donations); // Update donations state with the response data
      setTotalPages(response.data.totalPages); // Update totalPages with the response data
      setError(""); // Clear any previous error
      setLoading(false); // Set loading to false after fetching is complete
    } catch (err) {
      setError("Failed to fetch donations. Please try again.");
      console.error("❌ Error fetching donations:", err);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  const handleDeliverDonation = async (donationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/volunteer-deliver-donation", // Make sure this matches your backend route
        { donationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message); // Show a success message
      fetchDonations(currentPage); // Refresh the list of donations
    } catch (err) {
      console.error("❌ Error delivering donation:", err);
      alert("Failed to deliver the donation. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ngoEmail.trim()) {
      fetchDonations(); // Fetch donations based on NGO email
    } else {
      setError("Please enter a valid NGO email.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchDonations(newPage); // Fetch donations for the new page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Volunteer Dashboard</h1>

      {/* Input Field for NGO Email */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="email"
          value={ngoEmail}
          onChange={(e) => setNgoEmail(e.target.value)}
          placeholder="Enter NGO Email"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
          Search Donations
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading State */}
      {loading && <p>Loading donations...</p>}

      {/* Display Donations */}
      {donations.length === 0 ? (
        <p>No accepted donations found for the provided NGO email.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id} className="p-4 border-b">
              <h2 className="text-xl font-semibold">{donation.location}</h2>
              <p><strong>People Fed:</strong> {donation.peopleFed}</p>
              <p><strong>Contact:</strong> {donation.contact}</p>
              <p><strong>Expiry Date:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>

              {/* Deliver Button */}
              <button
                onClick={() => handleDeliverDonation(donation._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Deliver
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
