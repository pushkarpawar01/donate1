import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add unique timestamp to filenames
  },
});
const upload = multer({ storage: storage });

const darpanRegex = /^(AP|AR|AS|BR|CG|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB)\/\d{4}\/\d{7}$/;

const validateNgoEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingNgo = await User.findOne({ email: email }); // Check email in database

    if (existingNgo) {
      return res.json({ exists: true, message: "Email is registered" });
    } else {
      return res.json({ exists: false, message: "This NGO email is not registered." });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const signup = async (req, res) => {
  try {
    let { name, username, email, password, role, address, ngo_mail, darpanId } = req.body;

    if (darpanId) {
      darpanId = darpanId.trim();
    }

    if (role === "NGO" && (!darpanId || !darpanRegex.test(darpanId))) {
      return res.status(400).json({ message: "Invalid or missing Darpan ID" });
    }

    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if ((role === "Donor" || role === "NGO") && !address) {
      return res.status(400).json({ message: "Address is required for Donor and NGO" });
    }

    if (role === "Volunteer" && !ngo_mail) {
      return res.status(400).json({ message: "NGO Email is required for Volunteer" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      address,
      ngo_mail,
      darpan_id: darpanId,
      image_url: imageUrl,
      isApproved: role === "NGO" || role === "Volunteer" ? false : true, // NGOs & Volunteers need approval
    });

    await user.save();

    if (role === "Volunteer" && ngo_mail) {
      const ngo = await User.findOne({ email: ngo_mail, role: "NGO" });
      if (ngo) {
        const notification = new Notification({
          recipientEmail: ngo.email,
          message: `${name} has signed up as a Volunteer. Approve or Reject in Dashboard.`,
          type: "volunteer_signup",
        });
        await notification.save();
      }
    }

    res.status(201).json({ message: "Signup successful, awaiting NGO approval" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export default {
  validateNgoEmail,
  signup,
  upload,
};
