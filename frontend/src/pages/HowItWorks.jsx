import React from "react";
import { motion } from "framer-motion";
import "./HowItWorks.css";
import HeroSection2 from "./HeroSection2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HowItWorks = () => {
  return (
    <div>
      <Navbar/>
      <br />
      <br />
      <br />
      <br />
      <br />
    <motion.div
      className="how-it-works-container"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h1>How It Works</h1>
      <p className="how-it-works-text">
        Discover how SurplusLink connects surplus food sources with NGOs to reduce waste and support communities in need.
      </p>

      <div className="steps-container">
        <motion.div
          className="step"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <span className="step-icon">🔍</span>
          <h2>Identify Food Sources</h2>
          <p>
            Our platform identifies surplus food from various sources, ensuring nothing goes to waste.
          </p>
        </motion.div>

        <motion.div
          className="step"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="step-icon">🔗</span>
          <h2>Connect with NGOs</h2>
          <p>
            We match surplus food with NGOs that can distribute it to those in need.
          </p>
        </motion.div>

        <motion.div
          className="step"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <span className="step-icon">🚚</span>
          <h2>Efficient Delivery</h2>
          <p>
            Our system ensures timely delivery of food to NGOs, maximizing impact.
          </p>
        </motion.div>
      </div>
    </motion.div>
    <br />
    <HeroSection2/>
    <Footer/>
    </div>
  );
};

export default HowItWorks;
