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
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Donor", "NGO", "Volunteer"], required: true },
  address: { type: String, required: function() { return this.role === "Donor" || this.role === "NGO"; } },
  ngo_mail: { type: String, required: function() { return this.role === "Volunteer"; }, validate: {
    validator: async function(value) {
      // Validate if the ngo_mail exists
      const ngoUser = await User.findOne({ email: value });
      return ngoUser ? true : false; // Returns true if ngo_mail exists
    },
    message: "The provided NGO email does not exist."
  }},
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

const DonationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  peopleFed: { type: Number, required: true },
  contact: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "Pending" },
  ngoDetails: {
    ngoName: { type: String },  // Optional field, no need to specify `required: false`
    ngoEmail: { type: String }, // Optional field
    ngoContact: { type: String }, // Optional field
  },
  donorLocation: { type: { type: String, default: "Point" }, coordinates: [Number] }, // Optional field, no `required: false`
  volunteerLocation: { type: { type: String, default: "Point" }, coordinates: [Number] }, // Optional field
  rating: { type: Number, min: 0, max: 5, default: 0 }, // Optional field, no `required: false`
});

// Add geospatial indexes
DonationSchema.index({ donorLocation: "2dsphere" });
DonationSchema.index({ volunteerLocation: "2dsphere" });






const Donation = mongoose.model("Donation", DonationSchema);

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }, // To track whether the donor has read the notification
});

const Notification = mongoose.model("Notification", NotificationSchema);

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
    const { name, username, email, password, role, address, ngo_mail } = req.body;

    // Check if all required fields are provided
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle additional validation based on role
    if (role === "Donor" || role === "NGO") {
      if (!address) {
        return res.status(400).json({ message: "Address is required for Donor and NGO" });
      }
    }
    if (role === "Volunteer") {
      if (!ngo_mail) {
        return res.status(400).json({ message: "NGO Email is required for Volunteer" });
      }
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({ name, username, email, password: hashedPassword, role, address, ngo_mail });
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

app.get("/volunteer-acceptedDonations", authenticateRole(["Volunteer"]), async (req, res) => {
  try {
    const { ngoEmail } = req.query;  // Get NGO email from query params
    const { page = 1, limit = 10 } = req.query;  // Default page to 1 and limit to 10

    if (!ngoEmail) {
      return res.status(400).json({ message: "NGO email is required" });
    }

    // Fetch donations where status is "Accepted" and the NGO email matches, with pagination
    const donations = await Donation.find({
      "ngoDetails.ngoEmail": ngoEmail,
      status: "Accepted",
    })
      .skip((page - 1) * limit)  // Pagination skip
      .limit(limit)  // Pagination limit
      .select('donorEmail peopleFed location expiryDate status ngoDetails');

    // Get the total number of donations to return pagination info
    const totalDonations = await Donation.countDocuments({
      "ngoDetails.ngoEmail": ngoEmail,
      status: "Accepted",
    });

    res.status(200).json({
      donations,
      totalDonations,
      totalPages: Math.ceil(totalDonations / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ Error fetching accepted donations:", error);
    res.status(500).json({ message: "Error fetching accepted donations" });
  }
});

// ✅ Volunteer - Deliver Donation and Notify Donor
app.post("/volunteer-deliver-donation", authenticateRole(["Volunteer"]), async (req, res) => {
  try {
    const { donationId, volunteerLocation } = req.body;
    const { email: volunteerEmail } = req.user; // Get volunteer email from the logged-in user
    
    // Ensure valid donationId and volunteer location
    if (!donationId || !volunteerLocation) {
      return res.status(400).json({ message: "Donation ID and volunteer location are required" });
    }

    // Find the donation
    const donation = await Donation.findById(donationId);

    if (!donation || donation.status !== "Accepted") {
      return res.status(404).json({ message: "Donation not found or not accepted" });
    }

    // Update the donation with volunteer's location
    donation.volunteerLocation = { coordinates: [volunteerLocation.longitude, volunteerLocation.latitude] };
    
    // Create a notification for the donor
    const donorEmail = donation.donorEmail;
    const message = `Your donation is on its way! The volunteer is now heading towards your location.`;

    const notification = new Notification({
      donorEmail,
      message,
    });

    await notification.save();
    
    // Save the donation with updated location
    await donation.save();

    res.status(200).json({ message: "Donation marked for delivery and notification sent" });

  } catch (error) {
    console.error("❌ Error delivering donation:", error);
    res.status(500).json({ message: "Error delivering donation" });
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

// ✅ Get Donor's Accepted Donations
app.get("/my-donations", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const donorEmail = req.user.email; // Get donor's email from token

    // Fetch donations with status 'Accepted' for the logged-in donor
    const donations = await Donation.find({
      donorEmail,
      status: "Accepted",
    }).sort({ date: -1 }); // Sort by most recent donation

    res.status(200).json(donations);
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
});

app.get("/ngo-donations", authenticateRole(["NGO"]), async (req, res) => {
  try {
    // Assuming you want to fetch donations that are in "Pending" status
    const donations = await Donation.find({ status: "Pending" }).sort({ _id: -1 }); // Fetch only "Pending" donations
    res.status(200).json(donations); // Sending donations as the response
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
});


// ✅ NGO - Fetch Accepted Donations
app.get("/ngo-acceptedDonations", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const ngoEmail = req.user.email;
    console.log("Logged-in NGO email: ", ngoEmail); // Log the NGO's email for debugging
    
    const donations = await Donation.find({
      "ngoDetails.ngoEmail": ngoEmail,
      status: "Accepted"
    }).select('donorEmail peopleFed location expiryDate status ngoDetails'); // Only select necessary fields
    
    console.log("Fetched donations: ", donations); // Log the donations to ensure correct data
    
    res.status(200).json(donations); // Return the donations to the frontend
  } catch (error) {
    console.error("❌ Error fetching accepted donations:", error);
    res.status(500).json({ message: "Error fetching accepted donations" });
  }
});

// ✅ NGO - Update Donation Rating
// ✅ NGO - Update Donation Rating
app.post("/update-donation-rating", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const { donationId, rating } = req.body;

    // Check if donationId and rating are provided
    if (!donationId || rating === undefined) {
      return res.status(400).json({ message: "Donation ID and rating are required" });
    }

    // Validate donationId (should be a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    // Validate the rating (make sure it is between 0 and 5)
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    // Find the donation and update the rating field
    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { rating },
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation rating updated successfully", updatedDonation });
  } catch (error) {
    console.error("❌ Error updating donation rating:", error);
    res.status(500).json({ message: "Error updating donation rating" });
  }
});


// ✅ Rate Donation (Allow NGOs to rate donations they've accepted)
app.post("/rate-donation", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const { donationId, rating } = req.body;

    if (!donationId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    // Ensure that the rating is updated only for donations accepted by the NGO
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Make sure the logged-in NGO is the one that accepted the donation
    if (donation.ngoDetails.ngoEmail !== req.user.email) {
      return res.status(403).json({ message: "You cannot rate this donation" });
    }

    // Update the rating
    donation.rating = rating;
    await donation.save();

    res.status(200).json({ message: "Rating updated successfully", donation });
  } catch (error) {
    console.error("❌ Error rating donation:", error);
    res.status(500).json({ message: "Error rating donation" });
  }
});



// ✅ NGO - Update Donation Status (Accept/Reject)
app.post("/update-donation", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const { donationId, status } = req.body;
    const ngoEmail = req.user.email; // Get the logged-in NGO's email from the token
    const ngoName = req.user.name;  // Assuming 'name' field is part of the logged-in NGO details
    const ngoContact = req.user.contact; // Assuming 'contact' field is part of the logged-in NGO details

    if (!donationId || !status) {
      return res.status(400).json({ message: "Donation ID and status are required" });
    }

    // Update the donation with the new status and NGO details
    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { 
        status,
        ngoDetails: { ngoName, ngoEmail, ngoContact } // Set ngo details here
      },
      { new: true } // Return the updated document
    );

    // If donation is accepted, create a notification for the donor
    const donorEmail = updatedDonation.donorEmail;
    const message =
      status === "Accepted"
        ? `Your donation has been accepted by ${ngoName} at ${ngoContact}. Thank you for your generosity!`
        : `Your donation has been rejected by ${ngoName} at ${ngoContact}. Please consider donating again in the future.`;

    // Create a notification for the donor
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


// ✅ NGO - Request Food (Send Notification to All Donors)
app.post("/request-food", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const { ngoName, ngoEmail, ngoContact } = req.body;

    if (!ngoName || !ngoEmail || !ngoContact) {
      return res.status(400).json({ message: "NGO details are required" });
    }

    // Create a notification for all donors
    const message = `${ngoName} needs food donations. Please consider donating! Contact: ${ngoContact}`;

    // Fetch all donors and send them a notification
    const donors = await User.find({ role: "Donor" });

    for (const donor of donors) {
      const notification = new Notification({
        donorEmail: donor.email,
        message,
      });
      await notification.save();
    }

    res.status(200).json({ message: "Food request sent to all donors" });
  } catch (error) {
    console.error("❌ Error sending food request:", error);
    res.status(500).json({ message: "Error sending food request" });
  }
});

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

// ✅ Clear All Notifications for Donor
app.delete("/clear-all-notifications", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const donorEmail = req.user.email; // Get donor's email from token

    // Delete all notifications related to the donor
    await Notification.deleteMany({ donorEmail });

    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("❌ Error clearing notifications:", error);
    res.status(500).json({ message: "Error clearing notifications" });
  }
});


// ✅ Delete Individual Notification
app.delete("/delete-notification", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const { notificationId } = req.body; // Notification ID to delete

    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const deletedNotification = await Notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully", deletedNotification });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
