import { useState } from "react";
import axios from "axios";
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
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="Donor">Donor</option>
        <option value="NGO">NGO</option>
        <option value="Volunteer">Volunteer</option>
      </select>
      
      {/* Address field for Donor and NGO */}
      {(role === "Donor" || role === "NGO") && (
        <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      )}

      {/* ngo_mail field for Volunteer */}
      {role === "Volunteer" && (
        <input type="email" placeholder="NGO Email" onChange={(e) => setNgoMail(e.target.value)} />
      )}

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
