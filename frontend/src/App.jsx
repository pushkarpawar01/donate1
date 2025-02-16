import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import DonorNotifications from "./pages/DonorNotifications";
import Navbar from "./components/Navbar";
import MyDonations from "./pages/MyDonations";
import NGODonations from "./pages/NGODonations";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-notifications"
          element={
            <ProtectedRoute allowedRoles={["Donor"]}>
              <DonorNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-donations"
          element={
            <ProtectedRoute allowedRoles={["Donor"]}>
              <MyDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo-donations"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <NGODonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
