import React from "react";
import { useNavigate } from "react-router-dom";
import "./DonateDriveButton.css"; // Import the external CSS file

const DonateDriveButton = () => {
    const navigate = useNavigate();

    return (
        <div className="donate-drive-container">
            <h1 className="donate-drive-text">
                Explore ongoing donation drives and contribute to making a difference!  
                Click the button below to view the latest donation opportunities and help those in need.
            </h1>
            <button onClick={() => navigate("/donation-drives")} className="donate-drive-button">
                View Donation Drives
            </button>
        </div>
    );
};

export default DonateDriveButton;
