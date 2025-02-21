import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Donor");
  const [address, setAddress] = useState("");
  const [ngoMail, setNgoMail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // **Validation Function**
  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Username validation (at least 3 characters)
    if (!username.trim() || username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    // Email validation (valid email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password validation (minimum 6 characters)
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Address validation (required for Donor/NGO)
    if ((role === "Donor" || role === "NGO") && !address.trim()) {
      newErrors.address = "Address is required.";
    }

    // NGO email validation (required for Volunteers)
    if (role === "Volunteer" && (!ngoMail.trim() || !emailRegex.test(ngoMail))) {
      newErrors.ngoMail = "Enter a valid NGO email.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      await axios.post("http://localhost:5000/signup", {
        name, username, email, password, role, address, ngo_mail: ngoMail,
      });
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || "Please try again."));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-heading">Signup</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="Donor">Donor</option>
            <option value="NGO">NGO</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>

        {(role === "Donor" || role === "NGO") && (
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Enter address" onChange={(e) => setAddress(e.target.value)} />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>
        )}

        {role === "Volunteer" && (
          <div className="form-group">
            <label>NGO Email</label>
            <input type="email" placeholder="Enter NGO email" onChange={(e) => setNgoMail(e.target.value)} />
            {errors.ngoMail && <p className="error-text">{errors.ngoMail}</p>}
          </div>
        )}

        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
