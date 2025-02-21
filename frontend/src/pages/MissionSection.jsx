import React from "react";
import { motion } from "framer-motion";
import "./MissionSection.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MissionSection = () => {
  return (
    <div>
      <Navbar/>
      <br />
      <br />
      <br />
      <br />
      <br />
      
    <motion.div
      className="mission-container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h1>Our Story and Mission</h1>
      <p className="mission-text">
        Founded in 2023, SurplusLink is dedicated to reducing food waste and supporting NGOs.
        Our mission is to create a sustainable future by efficiently redistributing surplus
        food to those in need.
      </p>

      

      <div className="mission-cards">
        <motion.div
          className="mission-card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <span className="mission-icon">🌍</span>
          <h2>Sustainability Focus</h2>
          <p>
            At SurplusLink, we prioritize sustainability in every aspect of our operations.
            Our goal is to minimize food waste while ensuring that surplus food reaches those who need it most.
            Join us in making a difference.
          </p>
          <br />
        </motion.div>

        <motion.div
          className="mission-card"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="mission-icon">🤝</span>
          <h2>Community Commitment</h2>
          <p>
            We believe in the power of community support. By connecting food sources with NGOs,
            we help address hunger and foster a sense of togetherness.
            Together, we can create lasting change.
          </p>
        </motion.div>

        <motion.div
          className="mission-card"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <span className="mission-icon">⚡</span>
          <h2>Efficient Processes</h2>
          <p>
            Our platform is designed for efficiency. We ensure that surplus food is quickly identified,
            matched, and delivered to organizations that can utilize it effectively.
            <span className="highlight-text"> Time is of the essence in our mission.</span>
          </p>
        </motion.div>
      </div>
      <br />
      <br />
      <h1>Our Vision</h1>
      <p className="mission-text">
        Feeding India is a non-profit organization dedicated to eradicating hunger and improving malnutrition outcomes in India.
      </p>
      <p className="mission-text">
        We work toward this mission by supporting large-scale systemic interventions as well as providing essential food support to underserved communities in the form of raw grains and freshly cooked food.
      </p>
      <p className="mission-text">
        Feeding India works with on-ground non-profit partners working on education and child/maternal malnutrition by providing regular meals to dependents.
      </p>
    </motion.div>
    <Footer/>
    </div>
  );
};

export default MissionSection;
