import React from "react";
import "./HeroSection.css";
import { Link, useNavigate } from "react-router-dom";
import img1 from '../assets/tc1.webp';

const HeroSection = () => {
  const streamlitURL = "http://localhost:8501/";

  return (
    <div className="hero-container">
      <div className="hero-text">
        <h1>
          Join the Fight Against <br /> Food Waste
        </h1>
        <p>
          At Waste2Worth, we connect surplus food with NGOs to reduce waste and support communities. 
          Our platform ensures that food is efficiently redistributed to those in need, creating a sustainable future.
        </p>
        
        <div className="hero-input">
          <input type="email" placeholder="Enter your email" />
          <Link to="/signup"><button className="signup-btn">Sign up</button></Link>
        </div>
        <br />
        
        <p className="terms">
          By signing up, you agree to our <span>Terms and Conditions</span> and <span>Privacy Policy</span>. 
          We are committed to protecting your data and ensuring your privacy.
        </p>
      </div>
      {/* Button to open Streamlit app in a new tab */}
    
    </div>
    
  );
};

export default HeroSection;
