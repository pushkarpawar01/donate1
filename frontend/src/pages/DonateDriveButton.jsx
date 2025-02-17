import React from "react";
import { useNavigate } from "react-router-dom";

const DonateDriveButton = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/donation-drives")} style={buttonStyle}>
            View Donation Drives
        </button>
    );
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
