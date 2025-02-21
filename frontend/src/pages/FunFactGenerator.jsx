import React, { useEffect, useState } from "react";
import "./FunFactGenerator.css";

const facts = [
  "Dairy products should be stored at 1-4°C to prevent bacterial growth.",
  "Bread stays fresh longer in a cool, dry place rather than in the fridge.",
  "Fruits like apples and pears release ethylene gas, which can ripen other produce faster.",
  "Rice and grains should be stored in airtight containers at 10-15°C to avoid insect infestation.",
  "Vegetables like carrots and potatoes should not be stored together as potatoes release moisture.",
  "Every day, around 1.3 billion tons of food is wasted globally!",
  "Properly stored canned goods can last for years, but always check for damage or rust.",
  "Humidity levels in food storage areas should be kept below 60% to prevent mold growth.",
  "Freezing food at -18°C or lower can help preserve it for months without losing nutrients.",
  "Did you know? The average household wastes about 30-40% of purchased food!"
];

const FunFactGenerator = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextFact();
    }, 10000); // Change fact every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNextFact = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
      setFade(true);
    }, 300);
  };

  const handlePrevFact = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === 0 ? facts.length - 1 : prevIndex - 1
      );
      setFade(true);
    }, 300);
  };

  return (
    <div className="carousel-container">
      <button className="nav-button left" onClick={handlePrevFact}>‹</button>
      <div className={`carousel-slide ${fade ? "fade-in" : "fade-out"}`}>
        <p className="fact-text">{facts[currentFactIndex]}</p>
        <div className="static-lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <button className="nav-button right" onClick={handleNextFact}>›</button>
    </div>
  );
};

export default FunFactGenerator;
