import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Certificate from "./Certificate";

import "./VolunteerForm.jsx"
import "./VolunteerDelivery.css"; // Importing CSS file
import VolunteerForm from "./VolunteerForm.jsx";

const VolunteerDelivery = () => {
  const [image, setImage] = useState(null);

  // Handle Image Upload
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle Task Completion
  const handleCompleteDelivery = () => {
    alert("Delivery marked as completed!");
    // API call to update delivery status in the backend
  };

  return (
    <div className="delivery-container">
      <Navbar />
      <br />
      <br />
      <br />
      <div className="delivery-content">
        <h2>🎉 Congratulations on Reaching the Destination!</h2>
        <p className="highlight">✅ <strong>You have successfully arrived at the NGO location.</strong></p>
        
        <p>
          To complete the delivery process, please upload a photo of the food package being handed over. 
          This step is crucial for maintaining transparency and ensuring that donations reach the right hands.
        </p>
        
        <p>
          <strong>Make sure the uploaded image is:</strong>
          <ul>
            <li>📸 Clearly visible and not blurry.</li>
            <li>📦 Shows the food package or a confirmation from the NGO representative.</li>
            <li>📝 If possible, includes a timestamp or signature as proof.</li>
          </ul>
        </p>

        <p className="thank-you">
          🌍 <strong>Your efforts are making a real difference!</strong> Thank you for being a part of the EN-4 mission to reduce food waste and support those in need. 💙
        </p>

        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
        {image && <p className="image-name">📸 Image selected: {image.name}</p>}

        <button onClick={handleCompleteDelivery} className="complete-btn">
          ✅ Mark as Delivered
        </button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <VolunteerForm/>
      <Certificate/>
      <Footer/>
    </div>
  );
};

export default VolunteerDelivery;
