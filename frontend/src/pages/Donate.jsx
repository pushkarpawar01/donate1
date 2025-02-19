import React, { useState, useEffect } from "react";
import DonateDriveButton from "./DonateDriveButton";
import "./Donate.css";
import "../components/Footer.jsx"
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const Donate = () => {
    const [amount, setAmount] = useState("");
    const [ngoName, setNgoName] = useState("");
    const [upiId, setUpiId] = useState(""); // Added UPI ID input (optional)

    useEffect(() => {
        // Load Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Clean up script on component unmount
        };
    }, []);

    const handleDonate = async () => {
        if (!amount || !ngoName) {
            alert("Please enter both NGO name and donation amount.");
            return;
        }

        const response = await fetch("http://localhost:5000/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount, ngoName }),
        });

        const data = await response.json();
        if (!data.orderId || !data.key) {
            alert("Error creating order. Please try again.");
            return;
        }

        const options = {
            key: data.key,
            amount: amount * 100,
            currency: "INR",
            name: "Food Donation",
            description: `Donation to ${ngoName}`,
            order_id: data.orderId,
            handler: function (response) {
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            },
            prefill: {
                name: "Donor Name",
                email: "donor@example.com",
                contact: "9999999999",
            },
            theme: { color: "#3399cc" },
            method: {
                netbanking: true,
                card: true,
                upi: true, // Enables UPI
                wallet: true,
            },
        };

        if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            alert("Razorpay SDK not loaded. Please refresh and try again.");
        }
    };

    return (
        <div>
            <Navbar/>
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
            {/* <input
                type="text"
                placeholder="Your UPI ID (optional)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
            /> */}
            <button onClick={handleDonate}>Donate with Razorpay</button>
            <DonateDriveButton />

        </div>
        <Footer/>

        </div>

    );
};

export default Donate;
