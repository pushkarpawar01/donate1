import React from "react";
import { motion } from "framer-motion";
import "./SupportNGOs.css";

const SupportNGOs = () => {
  return (
    <motion.div 
      className="support-ngos-container"
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
        className="support-text"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        SurplusLink is dedicated to empowering NGOs with the resources and tools they need 
        to efficiently manage food distribution. Our platform offers real-time connections, 
        ensuring that surplus food is quickly identified, matched, and delivered to those 
        who need it most. By partnering with us, NGOs can enhance their mission to reduce 
        hunger and minimize food waste.
      </motion.p>

      <div className="features-container">
        {["Efficient Distribution", "Resource Management", "Real-Time Connections"].map((title, index) => (
          <motion.div
            key={index}
            className="feature"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2>{title}</h2>
            <p>
              {title === "Efficient Distribution" && "Streamline your food distribution process with our advanced logistics tools."}
              {title === "Resource Management" && "Optimize your resources with our comprehensive management solutions."}
              {title === "Real-Time Connections" && "Connect instantly with food sources to reduce waste and feed communities."}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SupportNGOs;
