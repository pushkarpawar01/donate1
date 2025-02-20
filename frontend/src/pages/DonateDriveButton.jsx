import React from "react";
import { useNavigate } from "react-router-dom";

const DonateDriveButton = () => {
    const navigate = useNavigate();

    return (
        <div style={containerStyle}>
            <h1 style={textStyle}>
                Explore ongoing donation drives and contribute to making a difference!  
                Click the button below to view the latest donation opportunities and help those in need.
            </h1>
            <button onClick={() => navigate("/donation-drives")} style={buttonStyle}>
                View Donation Drives
            </button>
            <br />
            <br />
        </div>
    );
};

const containerStyle = {
    textAlign: "center",
    marginTop: "20px",
};

const textStyle = {
    fontSize: "20px",
    color: "#333",
    marginBottom: "10px",
};

const buttonStyle = {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
};

export default DonateDriveButton;
