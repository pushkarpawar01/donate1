import React, { useState } from "react";
import axios from "axios";
import "./RequestFoodForm.css"; // Import CSS file

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RequestFoodForm = () => {
  const [numPeople, setNumPeople] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoContact, setNgoContact] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(""); // Error message for invalid NGO email
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Function to check if NGO email exists
  const validateNgoEmail = async (email) => {
    try {
      const response = await axios.post("http://localhost:5000/validate-ngo-email", { email });
      return response.data.exists; // Returns true if email exists, false otherwise
    } catch (error) {
      console.error("Error validating NGO email:", error);
      return false;
    }
  };

  const handleSendRequest = async () => {
    console.log("Sending request with:", { ngoName, ngoEmail, ngoContact, numPeople });

    // Validation
    if (!numPeople || numPeople <= 0) {
      setMessage("Please provide a valid number of people.");
      return;
    }
    if (!ngoName || !ngoEmail || !ngoContact) {
      setMessage("Please provide all the required NGO details.");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(ngoContact)) {
      setMessage("Please enter a valid 10-digit contact number.");
      return;
    }

    // Validate if NGO email exists
    const isNgoEmailValid = await validateNgoEmail(ngoEmail);
    if (!isNgoEmailValid) {
      setEmailError("This NGO email is not registered.");
      return;
    } else {
      setEmailError("");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User is not authenticated");
        return;
      }

      setLoading(true); // Start loading state

      const response = await axios.post(
        "http://localhost:5000/request-food",
        { ngoName, ngoEmail, ngoContact, numPeople },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Request successful:", response.data);
      setMessage(response.data.message);
      setNumPeople("");
      setNgoName("");
      setNgoEmail("");
      setNgoContact("");
    } catch (error) {
      console.error("❌ Error sending food request:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error sending food request. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <>
      <div className="request-food-form">
        <Navbar />
        
        <h2>Request Food from Donors</h2>

        <div>
          <label htmlFor="ngoName">NGO Name:</label>
          <input
            type="text"
            id="ngoName"
            value={ngoName}
            onChange={(e) => setNgoName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="ngoEmail">NGO Email:</label>
          <input
            type="email"
            id="ngoEmail"
            value={ngoEmail}
            onChange={(e) => setNgoEmail(e.target.value)}
            required
          />
          {emailError && <p className="error-text">{emailError}</p>} {/* Error for invalid NGO email */}
        </div>

        <div>
          <label htmlFor="ngoContact">NGO Contact:</label>
          <input
            type="text"
            id="ngoContact"
            value={ngoContact}
            onChange={(e) => setNgoContact(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="numPeople">Number of People:</label>
          <input
            type="number"
            id="numPeople"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <button onClick={handleSendRequest} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>

        {message && <p>{message}</p>} {/* Show success or error message */}
      </div>
      
      <Footer />
    </>
  );
};

export default RequestFoodForm;
