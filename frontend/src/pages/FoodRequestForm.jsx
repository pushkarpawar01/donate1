import React, { useState } from 'react';
import axios from 'axios';

const FoodRequestForm = () => {
  const [numPeople, setNumPeople] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleRequestFood = async () => {
    if (numPeople <= 0) {
      setMessage('Please provide a valid number of people.');
      return;
    }

    try {
      // Get the token from localStorage (or wherever you're storing it)
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('User is not authenticated');
        return;
      }

      // Fetch NGO details from the backend
      const response = await axios.get('/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { name, email, ngo_mail } = response.data;

      // Send food request and notification to all donors
      const notificationResponse = await axios.post(
        '/request-food',
        {
          ngoName: name,
          ngoEmail: email,
          ngoContact: ngo_mail,
          numPeople: numPeople,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setMessage(notificationResponse.data.message);
      setNumPeople(''); // Clear the input field after submission

    } catch (error) {
      console.error('❌ Error sending food request:', error);
      setMessage('Error sending food request. Please try again.');
    }
  };

  return (
    <div className="food-request-form">
      <h2>Request Food from Donors</h2>
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
        <button onClick={handleRequestFood}>Request Food</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default FoodRequestForm;
