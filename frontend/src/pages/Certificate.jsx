import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./Certificate.css"; // Create a separate CSS file for styling if needed
import Navbar from "../components/Navbar";

const Certificate = () => {
  const [userName, setUserName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  const generateCertificate = () => {
    if (userName.trim() === "") {
      alert("Please enter a volunteer name.");
      return;
    }
    setShowCertificate(true);
  };

  const downloadCertificate = () => {
    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement, { scale: 2, useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "EN4_Volunteer_Certificate.png";
      link.click();
    });
  };

  return (
    <div>
        <Navbar/>
    <div className="container">
      <h1>EN-4 Certificate of Appreciation</h1>
      <p>Your contribution has helped bridge the gap between surplus food and those in need.</p>

      <input
        type="text"
        placeholder="Enter Volunteer Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={generateCertificate}>Generate</button>
      <button onClick={downloadCertificate} disabled={!showCertificate}>
        Download Certificate
      </button>

      {showCertificate && (
        <div id="certificate" className="certificate">
          <div className="certificate-border">
            <div className="certificate-content">
              <h2>Certificate of Appreciation</h2>
              <p className="sub-text">Presented to</p>
              <div className="name">{userName}</div>
              <p>
                For their dedication and selfless service in helping redistribute surplus food to those in need.
              </p>
              <p>Your efforts have contributed to reducing food waste and making a real difference.</p>
              <p>
                <strong>Issued by: EN-4 Food Redistribution Initiative</strong>
              </p>
              <div className="footer-cert">
                <div className="date">Date: {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</div>
                <div className="signature">
                  <p>_________</p>
                  <p><strong>Authorized Signature</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Certificate;
