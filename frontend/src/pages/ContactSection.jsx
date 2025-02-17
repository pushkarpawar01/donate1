import React, { useEffect, useRef } from "react";
import "./ContactSection.css";

const ContactSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
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
    <div className="contact-container hidden" ref={sectionRef}>
            <h4>GET IN TOUCH</h4>

       <h2>We're Here to Help</h2>
      
      <p>For any questions or support, feel free to reach out to us directly.</p>


      <div className="contact-options">
        {/* Email Section */}
        <div className="contact-item">
          <span className="contact-icon">✉️</span>
          <h3>Email Us</h3>
          <p>
            Have inquiries? Send us an email at <br />
            <a href="mailto:contact@surpluslink.org">contact@surpluslink.org</a> and we will respond promptly.
          </p>
        </div>

        {/* Call Section */}
        <div className="contact-item">
          <span className="contact-icon">📞</span>
          <h3>Call Us</h3>
          <p>
            You can reach us by phone at <br />
            <strong>+91 9604358829</strong>. We're available to assist you with any questions.
          </p>
        </div>

        {/* Visit Section */}
        <div className="contact-item">
          <span className="contact-icon">📍</span>
          <h3>Visit Us</h3>
          <p>
            Our office is located at <br />
            <strong>A-101 Aeronest , Wadachiwadi Road, Undri 411060.</strong> Feel free to stop by!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
