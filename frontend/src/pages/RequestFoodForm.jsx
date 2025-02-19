import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RequestFoodForm = () => {
  const [numPeople, setNumPeople] = useState(""); // State to hold the number of people
  const [ngoName, setNgoName] = useState(""); // State for NGO name
  const [ngoEmail, setNgoEmail] = useState(""); // State for NGO email
  const [ngoContact, setNgoContact] = useState(""); // State for NGO contact
  const [message, setMessage] = useState(""); // State for success/error message

  // Handle form submission
  const handleSendRequest = async () => {
    // Check if the form fields are valid
    if (!numPeople || numPeople <= 0) {
      setMessage("Please provide a valid number of people.");
      return;
    }
    if (!ngoName || !ngoEmail || !ngoContact) {
      setMessage("Please provide all the required NGO details.");
      return;
    }

    try {
      // Get the token from localStorage (make sure user is logged in)
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User is not authenticated");
        return;
      }

      // Send food request data (NGO details and number of people) to the backend
      const response = await axios.post(
        "http://localhost:5000/request-food",  // Update the URL if required
        {
          ngoName,
          ngoEmail,
          ngoContact,
          numPeople,  // Include the number of people to feed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set success message and clear inputs after submission
      setMessage(response.data.message);
      setNumPeople(""); 
      setNgoName("");
      setNgoEmail("");
      setNgoContact("");
    } catch (error) {
      console.error("Error sending food request:", error);
      setMessage("Error sending food request. Please try again.");
    }
  };

  return (
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
        <button onClick={handleSendRequest}>Send Request</button>
      </div>

      {message && <p>{message}</p>} {/* Show success or error message */}
      
      <Footer />
    </div>
  );
};

export default RequestFoodForm;
