import React, { useEffect, useState, useRef } from "react";
import "./FeaturesSection.css";
import img4 from '../assets/tc4.webp'
import img5 from '../assets/tc5.webp'
import img6 from '../assets/tc6.webp'


const features = [
  {
    imgSrc: img4,
    title: "Real-Time Dashboard",
    description:
      "Our intuitive dashboard provides real-time insights into food redistribution activities, helping users track and manage surplus food efficiently.",
  },
  {
    imgSrc: img5,
    title: "Efficient Food Connections",
    description:
      "The SurplusLink process seamlessly connects food sources with NGOs, ensuring that surplus food reaches those who need it most.",
  },
  {
    imgSrc: img6,
    title: "Swift Delivery System",
    description:
      "Our robust delivery system ensures that surplus food is transported swiftly and safely to NGOs, minimizing waste and maximizing impact.",
  },
];

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={`features-section ${isVisible ? "visible" : "hidden"}`}>
      {features.map((feature, index) => (
        <div className="feature-card" key={index}>
          <img src={feature.imgSrc} alt={feature.title} className="feature-image" />
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeaturesSection;
