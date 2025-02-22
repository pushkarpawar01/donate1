import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Import the GoogleLogin component
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      
      const response = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      if(response.data.role === "Admin") {
        navigate("/admin-dashboard")
      }
      if (response.data.role === "Donor") {
        navigate("/donor-dashboard");
      } else if (response.data.role === "NGO") {
        navigate("/ngo-dashboard");
      } else if (response.data.role === "Volunteer") {
        navigate("/volunteer-dashboard");
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      
      const googleToken = response.credential; // Get the token from the response
      const res = await axios.post("http://localhost:5000/auth/google", { token: googleToken });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Navigate based on role
      
      if (res.data.role === "Donor") {
        navigate("/donor-dashboard");
      } else if (res.data.role === "NGO") {
        navigate("/ngo-dashboard");
      } else if (res.data.role === "Volunteer") {
        navigate("/volunteer-dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-heading">Login</h1>
        <div className="input-group">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <div className="google-login">
          <GoogleLogin 
            onSuccess={handleGoogleLogin} 
            onError={(error) => console.error(error)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
