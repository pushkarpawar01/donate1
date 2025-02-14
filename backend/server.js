const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// User Schema (Donor & NGO Authentication)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Donor", "NGO"], required: true },
});

const User = mongoose.model("User", UserSchema);

// Donation Schema
const DonationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  peopleFed: { type: Number, required: true },
  contact: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "Pending" },
  ngoDetails: { ngoName: String, ngoEmail: String, ngoContact: String },
});

const Donation = mongoose.model("Donation", DonationSchema);

// Middleware for Role-Based Access
const authenticateRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden access" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      console.error("❌ Authentication error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// ✅ Signup Routes
app.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, role: user.role, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ Donor - Submit Food Donation
app.post("/donate", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const { donorEmail, peopleFed, contact, expiryDate, location } = req.body;
    if (!donorEmail || !peopleFed || !contact || !expiryDate || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedExpiryDate = new Date(expiryDate);
    if (isNaN(parsedExpiryDate.getTime())) {
      return res.status(400).json({ message: "Invalid expiry date format" });
    }

    const newDonation = new Donation({ donorEmail, peopleFed, contact, expiryDate: parsedExpiryDate, location });
    await newDonation.save();

    res.status(201).json({ message: "Donation submitted successfully" });
  } catch (error) {
    console.error("❌ Donation submission error:", error);
    res.status(500).json({ message: "Error submitting donation" });
  }
});

// ✅ NGO - Fetch Pending Donations
app.get("/ngo-donations", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Pending" });
    res.status(200).json(donations);
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
});

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }, // To track whether the donor has read the notification
});

const Notification = mongoose.model("Notification", NotificationSchema);


// ✅ Update Donation Status
app.post("/update-donation", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const { donationId, status, ngoName, ngoEmail, ngoContact } = req.body;

    if (!donationId || !status) {
      return res.status(400).json({ message: "Donation ID and status are required" });
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { status, ngoDetails: { ngoName, ngoEmail, ngoContact } },
      { new: true }
    );

    // If donation is accepted, create a notification for the donor
    const donorEmail = updatedDonation.donorEmail;
    const message =
      status === "Accepted"
        ? `Your donation has been accepted by ${ngoName} at ${ngoContact}. Thank you for your generosity!`
        : `Your donation has been rejected by ${ngoName} at ${ngoContact}. Please consider donating again in the future.`;

    // Create notification for the donor
    const notification = new Notification({
      donorEmail,
      message,
    });

    await notification.save();

    res.status(200).json({ message: "Donation updated successfully", updatedDonation });
  } catch (error) {
    console.error("❌ Error updating donation:", error);
    res.status(500).json({ message: "Error updating donation" });
  }
});


    // If donation is accepted, create a notification for the donor
//     if (status === "Accepted") {
//       const donorEmail = updatedDonation.donorEmail;
//       const message = `Your donation has been accepted by ${ngoName} at ${ngoContact}. Thank you for your generosity!`;

//       const notification = new Notification({
//         donorEmail,
//         message,
//       });

//       await notification.save();
//     }

//     res.status(200).json({ message: "Donation updated successfully", updatedDonation });
//   } catch (error) {
//     console.error("❌ Error updating donation:", error);
//     res.status(500).json({ message: "Error updating donation" });
//   }
// });

// ✅ Get Donor Notifications
app.get("/donor-notifications", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const donorEmail = req.user.email; // Get donor's email from token

    const notifications = await Notification.find({ donorEmail }).sort({ date: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// ✅ Mark Notification as Read
app.post("/mark-notification-read", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({ message: "Notification marked as read", updatedNotification });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
