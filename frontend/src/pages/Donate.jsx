import React, { useState, useEffect } from "react";
import DonateDriveButton from "./DonateDriveButton";
import "./Donate.css";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const Donate = () => {
    const [amount, setAmount] = useState(""); 
    const [ngoName, setNgoName] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleAmountSelect = (selectedAmount) => {
        setAmount(selectedAmount.toString());
    };

    const handleCustomAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handlePayment = async () => {
        if (!ngoName || !amount || Number(amount) <= 0) {
            alert("Please enter a valid amount and NGO name.");
            return;
        }

        setShowModal(false);

        try {
            const response = await fetch("http://localhost:5000/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert("Razorpay SDK not loaded. Please refresh and try again.");
            }
        } catch (error) {
            alert("An error occurred while processing the payment.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="donate-container">
                <h2>Donate to an NGO</h2>
                <button onClick={() => setShowModal(true)}>Donate</button>
            </div>

            <DonateDriveButton />
            <Footer />

            {/* Payment Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Select Donation Amount</h3>
                        <div className="options">
                            <button className="option-btn" onClick={() => handleAmountSelect(750)}>₹750 (50 meals)</button>
                            <button className="option-btn" onClick={() => handleAmountSelect(1500)}>₹1500 (100 meals)</button>
                            <button className="option-btn" onClick={() => handleAmountSelect(3000)}>₹3000 (200 meals)</button>
                        </div>

                        {/* Custom Amount Input */}
                        <input
                            type="number"
                            placeholder="Enter custom amount (INR)"
                            value={amount}
                            onChange={handleCustomAmountChange}
                            className="ngo-input"
                        />

                        {/* NGO Name Input */}
                        <input
                            type="text"
                            placeholder="Enter NGO Name"
                            value={ngoName}
                            onChange={(e) => setNgoName(e.target.value)}
                            className="ngo-input"
                        />

                        <p className="info-text">
                            To address malnutrition in India, we need to serve 250 nutritious meals per child every academic year.
                        </p>

                        <button className="pledge-btn" onClick={handlePayment} disabled={!ngoName || !amount}>
                            Pledge your contribution here
                        </button>

                        <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donate;
