import React from "react";
import "./HeroSection.css";
import img1 from '../assets/tc1.webp'

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-text">
        <h1>
          Join the <span className="highlight">Fight</span> Against <br /> Food Waste
        </h1>
        <p>
          At SurplusLink, we connect surplus food with NGOs to reduce waste and support communities. 
          Our platform ensures that food is efficiently redistributed to those in need, creating a sustainable future.
        </p>
        
        <div className="hero-input">
          <input type="email" placeholder="Enter your email" />
          <button className="signup-btn">Sign up</button>
        </div>
        <br />
        
        <p className="terms">
          By signing up, you agree to our <span>Terms and Conditions</span> and <span>Privacy Policy</span>. 
          We are committed to protecting your data and ensuring your privacy.
        </p>
      </div>
     
    </div>
  );
};

export default HeroSection;
