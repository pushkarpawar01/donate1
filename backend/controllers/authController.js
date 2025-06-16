import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use environment variable for Google Client ID

const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Use environment variable for Google Client ID
    });

    const payload = ticket.getPayload(); // Get user info from the token
    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;

    // Check if the user exists in the database
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({
        email,
        name,
        username: googleId,
        role: "Donor", // Set default role, or update this logic based on your app
      });
      await user.save();
    }

    // Create a JWT token and send it in the response
    const jwtToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: jwtToken, role: user.role, message: "Login successful" });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Error with Google login" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Hardcoded admin credentials
    const adminEmail = "admin@example.com";  // You can change this to your preferred admin email
    const adminPassword = "admin123";  // You can change this to your preferred admin password

    // Check if the email and password match the hardcoded admin credentials
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ email, role: "Admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.status(200).json({ token, role: "Admin", message: "Admin login successful" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // If the user is an NGO and not approved
    if (user.role === "NGO" && !user.isApproved) {
      return res.status(403).json({ message: "Your NGO account is awaiting approval from the admin." });
    }

    if (user.frozen) {
      return res.status(403).json({ message: "Your account is frozen" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, role: user.role, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export default {
  googleAuth,
  login,
};
