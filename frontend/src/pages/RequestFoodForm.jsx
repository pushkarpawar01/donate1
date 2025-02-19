import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RequestFoodForm = () => {
  const [numPeople, setNumPeople] = useState(""); // State to hold the number of people
  const [message, setMessage] = useState(""); // State to show success or error message

  // Handle form submission
  const handleSendRequest = async () => {
    // Check if the number of people is valid
    if (!numPeople || numPeople <= 0) {
      setMessage("Please provide a valid number of people.");
      return;
    }

    try {
      // Make the API request to send the food request (we'll add the backend URL later)
      const response = await axios.post("/api/request-food", {
        numPeople,
      });

      setMessage(response.data.message); // Show the success message from the backend
      setNumPeople(""); // Reset the input field after submission

    } catch (error) {
      console.error("Error sending food request:", error);
      setMessage("Error sending food request. Please try again.");
    }
  };

  return (
    <div className="request-food-form">
        <Navbar/>
      <h2>Request Food</h2>
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

      {message && <p>{message}</p>} {/* Display message if any */}
      <Footer/>
    </div>
  );
};

export default RequestFoodForm;
