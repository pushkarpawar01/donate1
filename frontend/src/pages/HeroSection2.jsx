import React from "react";
import { motion } from "framer-motion";
import "./HeroSection2.css";

const HeroSection2 = () => {
  return (
    <section className="hero">
      {/* Heading Animation */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        Efficiently Connect Surplus Food with NGOs
      </motion.h1>

      {/* Paragraph Animation */}
      <motion.p 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.3 }}
      >
        Discover how <span className="highlight">SurplusLink</span> transforms surplus food into valuable 
        resources for NGOs. Our platform identifies excess food, matches it with suitable 
        organizations, and ensures timely delivery, minimizing waste and supporting community needs.
      </motion.p>

      {/* Features List Animation */}
      <motion.ul className="features"
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.li initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>🔗 Identify surplus food sources quickly</motion.li>
        <motion.li initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>🔗 Match with NGOs in real-time</motion.li>
        <motion.li initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }}>🔗 Ensure efficient delivery to those in need</motion.li>
      </motion.ul>
    </section>
  );
};

export default HeroSection2;
