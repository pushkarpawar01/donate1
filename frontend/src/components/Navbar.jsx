import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // NGO or Donor
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Surplus<span>Link</span>
      </Link>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`dashboard-link ${isMenuOpen ? "open" : ""}`}>
        {/* Default Navbar for Home Page (No login required) */}
        {!token && (
          <>
            <Link to="/mission" onClick={() => setIsMenuOpen(false)}>Mission</Link>
            <Link to="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</Link>
          </>
        )}

        {/* NGO-Specific Dashboard (Only for NGOs) */}
        {token && role === "NGO" && (
          <>
            <Link to="/ngo-dashboard" onClick={() => setIsMenuOpen(false)}>NGO Dashboard</Link>
            <Link to="/ngo-donations" onClick={() => setIsMenuOpen(false)}>Donations</Link>
            <Link to="/request-food" onClick={() => setIsMenuOpen(false)}>Request Food</Link>
            {/* <Link to="/accepted-donations" onClick={() => setIsMenuOpen(false)}>Accepted Donations</Link>
            <Link to="/donation-history" onClick={() => setIsMenuOpen(false)}>History</Link> */}
          </>
        )}

        {/* Donor-Specific Dashboard (Only for Donors) */}
        {token && role === "Donor" && (
          <>
            <Link to="/donor-dashboard" onClick={() => setIsMenuOpen(false)}>Donor Dashboard</Link>
            <Link to="/donor-notifications" onClick={() => setIsMenuOpen(false)}>Notifications</Link>
            <Link to="/my-donations" onClick={() => setIsMenuOpen(false)}>My Donations</Link>
            <Link to="/donate" onClick={() => setIsMenuOpen(false)}>Donate NGO</Link>
          </>
        )}
      </div>

      {/* Profile & Logout Section */}
      <div className="profile-logout">
        {token ? (
          <>
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Profile"
              className="profile-icon"
            />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
