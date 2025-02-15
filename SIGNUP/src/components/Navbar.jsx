import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import your CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">MealMate 🤮</div>
        <div className="dashboard-link">
          {role === "Donor" && (
            <Link to="/donor-dashboard" className="dashboard-item">
              Donor Dashboard
            </Link>
          )}
          {role === "NGO" && (
            <Link to="/ngo-dashboard" className="dashboard-item">
              NGO Dashboard
            </Link>
          )}
        </div>
        <div className="profile-logout">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Profile"
            className="profile-icon"
          />
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
