const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Razorpay = require("razorpay");


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
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
  rating:{type:Number,default:5.0},
  totalRatings : {type:Number,default:0},
  frozen :{type:Boolean,default:false},
  address: { 
    type: String, 
    validate: {
      validator: function(value) {
        if (this.role === "Donor" || this.role === "NGO") {
          return !!value; // Ensures value is not empty
        }
        return true; // If not Donor/NGO, no validation needed
      },
      message: "Address is required for Donor and NGO"
    }
  },
  ngo_mail: { 
    type: String, 
    validate: {
      validator: async function(value) {
        if (this.role === "Volunteer") {
          const ngoUser = await User.findOne({ email: value });
          return !!ngoUser; // Ensures NGO email exists
        }
        return true; // If not Volunteer, no validation needed
      },
      message: "The provided NGO email does not exist."
    }
  }
});

const razorpay = new Razorpay({
  key_id: "rzp_test_BFlJZGyBOvGkkx",  // Replace with your Razorpay Test Key ID
  key_secret: "kZlfisR8ju5SKoTfMbMJkb82",  // Replace with your Razorpay Test Secret Key
});

app.post("/create-order", async (req, res) => {
  const { amount, ngoName } = req.body;

  if (!amount || !ngoName) {
      return res.status(400).json({ error: "Amount and NGO name are required" });
  }

  try {
      const order = await razorpay.orders.create({
          amount: amount * 100, // Convert INR to paise
          currency: "INR",
          payment_capture: 1,
      });

      res.json({ orderId: order.id, key: "rzp_test_BFlJZGyBOvGkkx" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
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
  // donorLocation: { type: { type: String, default: "Point" }, coordinates: [Number] }, // Optional field, no `required: false`
  // volunteerLocation: { type: { type: String, default: "Point" }, coordinates: [Number] }, // Optional field
  rating: { type: Number, min: 0, max: 5, default: 0 }, // Optional field, no `required: false`
});

DonationSchema.index({ "ngoDetails.ngoEmail": 1, status: 1 });


// Add geospatial indexes
// DonationSchema.index({ donorLocation: "2dsphere" });
// DonationSchema.index({ volunteerLocation: "2dsphere" });


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

app.post("/validate-ngo-email", async (req, res) => {
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
});



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

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("1047403268522-mcrb7eb9ila347tfvr6v5f9j55fua92k.apps.googleusercontent.com"); // Use your Google Client ID

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1047403268522-mcrb7eb9ila347tfvr6v5f9j55fua92k.apps.googleusercontent.com", // Your Google Client ID
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

    if(user.frozen){
      return res.status(403).json({message:"Your account is frozen"});
    }

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

    // Sanitize page and limit parameters (Ensure they're valid numbers)
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ message: "Invalid limit value" });
    }

    // Fetch donations where status is "Accepted" and the NGO email matches, with pagination
    const donations = await Donation.find({
      "ngoDetails.ngoEmail": ngoEmail,
      status: "Accepted",
    })
      .skip((pageNumber - 1) * limitNumber)  // Pagination skip
      .limit(limitNumber)  // Pagination limit
      .select('donorEmail peopleFed location expiryDate status ngoDetails');

    if (donations.length === 0) {
      return res.status(404).json({ message: "No accepted donations found for the provided NGO email" });
    }

    // Get the total number of donations to return pagination info
    const totalDonations = await Donation.countDocuments({
      "ngoDetails.ngoEmail": ngoEmail,
      status: "Accepted",
    });

    res.status(200).json({
      donations,
      totalDonations,
      totalPages: Math.ceil(totalDonations / limitNumber),
      currentPage: pageNumber,
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
    const message = `Volunteer is on the Way! The volunteer is now heading towards your location.`;

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

    // if (!location.latitude || !location.longitude) {
    //   return res.status(400).json({ message: "Invalid location format. Must include latitude and longitude." });
    // }

    // Parse the submitted expiry date
    const parsedExpiryDate = new Date(expiryDate);
    if (isNaN(parsedExpiryDate.getTime())) {
      return res.status(400).json({ message: "Invalid expiry date format" });
    }

    // ✅ Expiry Date Validation (Must be at least 1 day later than today)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Remove time to compare only the date

    // Adjust for the timezone offset
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localDate = new Date(currentDate.getTime() - timezoneOffset);

    const minExpiryDate = new Date(localDate);
    minExpiryDate.setDate(localDate.getDate() + 1); // Expiry date must be at least tomorrow

    // Debug Logs
    console.log("🟢 Current Local Date:", localDate.toISOString().split("T")[0]);
    console.log("🟢 Minimum Allowed Expiry Date:", minExpiryDate.toISOString().split("T")[0]);
    console.log("🟡 Submitted Expiry Date:", expiryDate);

    // ❌ Reject if expiry date is not at least 1 day later
    if (parsedExpiryDate < minExpiryDate) {
      return res.status(400).json({ message: "Expiry date must be at least one day after today." });
    }

    // ✅ Save the donation if all validations pass
    const newDonation = new Donation({
      donorEmail,
      peopleFed,
      contact,
      expiryDate: parsedExpiryDate,
      location,
      // donorLocation: {
      //   type: "Point",
      //   coordinates: [location.longitude, location.latitude], // Store in GeoJSON format
      // },
      status: "Pending",
    });

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
app.post("/rate-donation", authenticateRole(["NGO"]), async (req, res) => {
  try {
    console.log("🔹 Incoming Request Body:", req.body);
    const { donationId, rating } = req.body;

    // Validate input
    if (!donationId || rating === undefined || rating < 1 || rating > 5) {
      console.log("❌ Invalid input: donationId or rating missing/invalid");
      return res.status(400).json({ message: "Invalid rating input" });
    }

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    // Find donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      console.log("❌ Donation not found for ID:", donationId);
      return res.status(404).json({ message: "Donation not found" });
    }

    if (!donation.ngoDetails?.ngoEmail) {
      console.log("❌ donation.ngoDetails is missing!", donation);
      return res.status(500).json({ message: "Donation data is corrupted" });
    }

    // Ensure logged-in NGO is the one that accepted the donation
    if (donation.ngoDetails.ngoEmail !== req.user.email) {
      console.log("❌ Unauthorized: NGO email mismatch");
      return res.status(403).json({ message: "You cannot rate this donation" });
    }

    // Update the donation rating
    donation.rating = rating;
    await donation.save();

    // Recalculate donor's average rating
    const ratedDonations = await Donation.find({ donorEmail: donation.donorEmail, rating: { $gt: 0 } });
    const avgRating = ratedDonations.reduce((sum, d) => sum + d.rating, 0) / ratedDonations.length;

    // Update donor's rating and freeze account if necessary
    const donor = await User.findOneAndUpdate(
      { email: donation.donorEmail, role: "Donor" },
      { 
        rating: avgRating, 
        totalRatings: ratedDonations.length, 
        frozen: avgRating < 2.5 
      },
      { new: true }
    );

    if (!donor) {
      console.log("❌ Donor not found or update failed!");
      return res.status(404).json({ message: "Donor not found" });
    }

    console.log("✅ Rating updated successfully:", { avgRating, frozen: donor.frozen });

    res.status(200).json({ 
      message: "Rating updated successfully", 
      donation, 
      donor: { email: donor.email, avgRating, frozen: donor.frozen } 
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Error rating donation", error: error.message });
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

// Backend - Get logged-in user info
app.get("/user", authenticateRole(["NGO"]), async (req, res) => {
  try {
    // Get the logged-in user from the authenticated request (assuming `req.user` holds the user data)
    const user = req.user;  // Assuming the user info is in `req.user`
    
    // Return the relevant details based on the user's role (NGO)
    const { name, email, ngo_mail } = user;
    res.status(200).json({ name, email, ngo_mail });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
});



// POST request to send food request to all donors
app.post("/request-food", authenticateRole(["NGO"]), async (req, res) => {
  try {
    const { numPeople, ngoName, ngoEmail, ngoContact } = req.body;  

    if (!numPeople || numPeople <= 0) {
      return res.status(400).json({ message: "Number of people is required" });
    }

    if (!ngoName || !ngoEmail || !ngoContact) {
      return res.status(400).json({ message: "All NGO details are required" });
    }

    // Fetch the logged-in NGO details using JWT token (User schema)
    const ngo = await User.findOne({ email: req.user.email, role: "NGO" });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    console.log("🔹 NGO Details:", { ngoName, ngoEmail, ngoContact, numPeople });

    // Find all donors
    const donors = await User.find({ role: "Donor" });
    console.log("🔹 Found donors:", donors.length);

    for (const donor of donors) {
      const notification = new Notification({
        donorEmail: donor.email,
        message: `${ngoName} needs food for ${numPeople} people. Contact: ${ngoContact}, Email: ${ngoEmail}`,
      });
      await notification.save();
    }

    res.status(200).json({ message: "Food request sent successfully" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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
