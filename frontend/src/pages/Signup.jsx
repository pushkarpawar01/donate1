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
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/signup", { name, username, email, password, role, address, ngo_mail: ngoMail });
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + err.response.data.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-heading">Signup</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
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
          </div>
        )}

        {role === "Volunteer" && (
          <div className="form-group">
            <label>NGO Email</label>
            <input type="email" placeholder="Enter NGO email" onChange={(e) => setNgoMail(e.target.value)} />
          </div>
        )}

        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
