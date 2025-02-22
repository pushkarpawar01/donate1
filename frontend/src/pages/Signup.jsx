import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import UploadImage from "./UploadImage";  // Import the UploadImage component

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Donor");
  const [address, setAddress] = useState("");
  const [ngoMail, setNgoMail] = useState("");
  const [darpanId, setDarpanId] = useState("");
  const [image, setImage] = useState(null); // State for the uploaded image
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const darpanRegex = /^(AP|AR|AS|BR|CG|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB)\/\d{4}\/\d{7}$/;

  // **Validation Function**
  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!username.trim() || username.length < 3) newErrors.username = "Username must be at least 3 characters.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) newErrors.email = "Enter a valid email address.";
    if (!password || password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if ((role === "Donor" || role === "NGO") && !address.trim()) {
      newErrors.address = "Address is required.";
    }
    
    if (role === "Volunteer" && (!ngoMail.trim() || !emailRegex.test(ngoMail))) {
      newErrors.ngoMail = "Enter a valid NGO email.";
    }

    // Validate Darpan ID for NGOs
    if (role === "NGO") {
      if (!darpanId.trim() || !darpanRegex.test(darpanId)) {
        newErrors.darpanId = "Enter a valid Darpan ID (e.g., RJ/2024/1234567).";
      }

      // Check if image is selected for NGOs
      if (!image) {
        newErrors.image = "Image is required for NGO signup.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("address", address);
    formData.append("ngo_mail", ngoMail);
    formData.append("darpanId", darpanId);
    formData.append("image", image); // Attach the image file to form data

    try {
      await axios.post("http://localhost:5000/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
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

        {/* Darpan ID field for NGOs */}
        {role === "NGO" && (
          <div className="form-group">
            <label>Darpan ID</label>
            <input
              type="text"
              placeholder="Enter Darpan ID (e.g., RJ/2024/1234567)"
              value={darpanId} 
              onChange={(e) => setDarpanId(e.target.value)}
            />
            {errors.darpanId && <p className="error-text">{errors.darpanId}</p>}
          </div>
        )}

        {/* Image upload for NGOs */}
        {role === "NGO" && (
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {errors.image && <p className="error-text">{errors.image}</p>}
          </div>
        )}

        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
