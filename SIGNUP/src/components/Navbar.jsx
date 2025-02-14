import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">Food Donation System</div>
        <div>
          {role === "Donor" && <Link to="/donor-dashboard" className="text-white mr-4">Donor Dashboard</Link>}
          {role === "NGO" && <Link to="/ngo-dashboard" className="text-white mr-4">NGO Dashboard</Link>}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
