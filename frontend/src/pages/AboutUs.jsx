import React from "react";
import "./HomePage.css";
import Sustainability from "./Sustainability";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <div>
      <Navbar/>
      <Sustainability/>
      <Footer/>
    </div>
  );
};

export default AboutUs;
