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
  const [fact, setFact] = useState("");
  const [showFact, setShowFact] = useState(true);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    setFact(facts[randomIndex].replace(/\s+/g, ' '));
  }, []);

  return (
    showFact && (
      <div className="container">
        <div className="card">
          <p className="fact-text">{fact}</p>
          <button onClick={() => setShowFact(false)} className="close-button">✖</button>
        </div>
      </div>
    )
  );
};

export default FunFactGenerator;
