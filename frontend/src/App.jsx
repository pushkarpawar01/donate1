import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import './App.css'; // Make sure this is imported
import ChatButton from "./pages/ChatButton";
import FunFactGenerator from "./pages/FunFactGenerator";

import MissionSection from './pages/MissionSection'
import HeroSection from './pages/HeroSection'
import HowItWorks from './pages/HowItWorks'
import Footer from './components/Footer'
import SupportNGOs from './pages/SupportNGOs'
import HomePage from './pages/HomePage'
import ContactSection from './pages/ContactSection'
import HeroSection2 from './pages/HeroSection2'
import FeaturesSection from './pages/FeaturesSection'
import Contact_form from './pages/SupportForm'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import DonorNotifications from "./pages/DonorNotifications";
import MyDonations from "./pages/MyDonations";
import NGODonations from "./pages/NGODonations";
import AboutUs from "./pages/AboutUs";
import SupportForm from "./pages/SupportForm";
import Donate from "./pages/Donate";
import DonationDrives from "./pages/DonationDrives";
import MapPage from "./pages/MapPage";
import RequestFoodForm from "./pages/RequestFoodForm";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  const CLIENT_ID = "1047403268522-mcrb7eb9ila347tfvr6v5f9j55fua92k.apps.googleusercontent.com"; // Replace with your Google Client ID

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
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
            path="/food-request-form"
            element={
              <ProtectedRoute allowedRoles={["NGO"]}>
                <br />
                <br />
                <br />
                
                <RequestFoodForm />
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

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donation-drives" element={<DonationDrives />} />
          <Route path="/mission" element={<MissionSection />} />
          <Route path="/hero" element={<HeroSection />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/support-ngos" element={<SupportNGOs />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/hero-2" element={<HeroSection2 />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/contact-form" element={<Contact_form />} />
          <Route path="/support-form" element={<SupportForm />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
