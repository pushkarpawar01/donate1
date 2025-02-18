import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./HomePage.css";
import HeroSection from "./HeroSection";
import MissionSection from "./MissionSection";
import SupportNGOs from "./SupportNGOs";
import FeaturesSection from "./FeaturesSection";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <HeroSection />
      <MissionSection />
      <SupportNGOs />

      {/* Supporting NGOs Section */}
      <motion.section 
        className="support-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Supporting NGOs in Food Distribution
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          SurplusLink is dedicated to empowering NGOs with the resources and tools they need 
          to efficiently manage food distribution. Our platform offers real-time connections, 
          ensuring that surplus food is quickly identified, matched, and delivered to those who 
          need it most. By partnering with us, NGOs can enhance their mission to reduce hunger 
          and minimize food waste.
        </motion.p>

        <div className="features">
          {[
            { icon: "🚚", title: "Efficient Distribution", desc: "Streamline your food distribution process with our advanced logistics tools." },
            { icon: "📈", title: "Resource Management", desc: "Optimize your resources with our comprehensive management solutions." },
            { icon: "🔄", title: "Real-Time Connections", desc: "Connect instantly with food sources to reduce waste and feed communities." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <span className="icon">{feature.icon}</span>
              <h2>{feature.title}</h2>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Donate Button */}
        <motion.button
          className="donate-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/donate")}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            backgroundColor: "#FF5733",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Donate Now
        </motion.button>
      </motion.section>

      {/* Join Our Mission Section */}
      <motion.section 
        className="mission-section"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2>Join Our Mission</h2>
        <p>
          Become a part of SurplusLink's network and help us create a sustainable future.
          Together, we can optimize food resources and reduce hunger.
        </p>
        <motion.button
          className="contact-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Contact Us
        </motion.button>
      </motion.section>

      {/* Get in Touch Section */}
      <motion.section 
        className="contact-section"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h4>Get in Touch</h4>
        <h2>We’d love to hear from you!</h2>
        <p>
          Have any questions or want to collaborate? Contact us today and become part of our mission to reduce food waste.
        </p>
        <motion.button
          className="contact-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Reach Out
        </motion.button>
      </motion.section>
      
      <FeaturesSection />
    </div>
  );
};

export default HomePage;
