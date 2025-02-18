import React, { useState } from "react";
import DonateDriveButton from "./DonateDriveButton"; // Import the new button
import "./Donate.css"; // Import the CSS file for styling

const Donate = () => {
    const [amount, setAmount] = useState("");
    const [ngoName, setNgoName] = useState("");

    const handleDonate = async () => {
        // Making a POST request to the backend to create an order
        const response = await fetch("http://localhost:5000/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount, ngoName }), // Send the amount and NGO name to the backend
        });

        const { orderId, key } = await response.json(); // Get the orderId and Razorpay key from the backend response

        const options = {
            key: key, // Razorpay Key ID
            amount: amount * 100, // Amount in paise (multiply by 100)
            currency: "INR",
            name: "Food Donation",
            description: `Donation to ${ngoName}`,
            order_id: orderId, // Order ID from the backend
            handler: function (response) {
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            },
            theme: { color: "#3399cc" },
        };

        // Open the Razorpay checkout modal
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="donate-container">
            <h2>Donate to an NGO</h2>
            <input
                type="text"
                placeholder="NGO Name"
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount (INR)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleDonate}>Donate with Razorpay</button>
            <DonateDriveButton />
        </div>
    );
};

export default Donate;
