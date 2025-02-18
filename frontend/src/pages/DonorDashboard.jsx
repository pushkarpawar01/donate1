import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const DonorDashboard = () => {
  const [donation, setDonation] = useState({
    donorEmail: "",
    peopleFed: "",
    contact: "",
    expiryDate: "",
    location: "",
  });

  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for the donor
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/donor-notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    setDonation({ ...donation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/donate", donation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Donation submitted successfully!");
      setDonation({ donorEmail: "", peopleFed: "", contact: "", expiryDate: "", location: "" });
    } catch (error) {
      alert("Failed to submit donation. Please try again.");
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Donor Dashboard</h1>

        {/* Donation Form */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="donorEmail"
            placeholder="Donor Email"
            value={donation.donorEmail}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="number"
            name="peopleFed"
            placeholder="People Fed"
            value={donation.peopleFed}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={donation.contact}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="date"
            name="expiryDate"
            value={donation.expiryDate}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={donation.location}
            onChange={handleInputChange}
            className="border p-2"
          />
        </div>
        <button onClick={handleSubmit} className="bg-green-500 text-white p-2 mt-4 rounded">
          Submit Donation
        </button>
      </div>
    </div>
  );
};

export default DonorDashboard;
