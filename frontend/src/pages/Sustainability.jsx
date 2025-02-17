import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import img2 from './assets/tc3.webp';
import img3 from './assets/poor_child.jpg';
import "./Sustainability.css";

const statsData = [
  { label: "Impact Percentage", target: 100, suffix: "%" },
  { label: "Food Redistributed", target: 5000, suffix: " kg" },
  { label: "Partner NGOs", target: 50, suffix: "" },
  { label: "Real-time Connections", target: 20, suffix: "+" },
];

const Sustainability = () => {
  const [stats, setStats] = useState(statsData.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const intervalTime = 50;
    const increments = statsData.map(({ target }) => target / (duration / intervalTime));

    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((value, index) => 
          value + increments[index] < statsData[index].target ? value + increments[index] : statsData[index].target
        )
      );
    }, intervalTime);

    setTimeout(() => clearInterval(interval), duration);
  }, []);

  return (
    <div className="sustainability-sections">
      <motion.div 
        className="sustainability-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="sustainability-content">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Commitment to <br /><span>Sustainability</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            At SurplusLink, we are dedicated to reducing food waste and supporting communities in need. 
            Our mission is to connect surplus food sources with NGOs, ensuring that every meal counts and no food goes to waste.
          </motion.p>
          <div className="stats">
            {statsData.map((stat, index) => (
              <motion.div 
                className="stat-card" 
                key={index}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3>{Math.round(stats[index])}{stat.suffix}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div 
          className="sustainability-image"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img src={img2} alt="People organizing food donations" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="sustainability-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="sustainability-image"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img src={img3} alt="Food redistribution journey" />
        </motion.div>
        <div className="sustainability-content">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Journey Towards <br /><span>Sustainability</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            SurplusLink was founded in 2023 with a mission to combat food waste and hunger. 
            Our innovative platform connects food sources with NGOs, ensuring that surplus food is efficiently redistributed to those in need.
          </motion.p>
          <div className="stats">
            {[
              "Through our platform, we have significantly reduced food waste, ensuring surplus food reaches those in need efficiently.",
              "Over the past two years, thousands of kilograms of surplus food have been redistributed, providing meals to underserved communities.",
              "We have built a strong network of organizations dedicated to fighting hunger and promoting sustainable food distribution.",
              "Our real-time connections between food donors and NGOs have streamlined the redistribution process, making food rescue faster and more effective.",
            ].map((text, index) => (
              <motion.div 
                className="stat-card" 
                key={index}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sustainability;
