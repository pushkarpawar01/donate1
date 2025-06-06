const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Razorpay = require("razorpay");
const path = require('path');

// dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));
const darpanRegex = /^(AP|AR|AS|BR|CG|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB)\/\d{4}\/\d{7}$/;

// User Schema (Donor & NGO Authentication)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Donor", "NGO", "Volunteer"], required: true },
  rating: { type: Number, default: 5.0 },
  totalRatings: { type: Number, default: 0 },
  frozen: { type: Boolean, default: false },
  address: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.role === "Donor" || this.role === "NGO") {
          return !!value; // Ensures value is not empty
        }
        return true; // If not Donor/NGO, no validation needed
      },
      message: "Address is required for Donor and NGO",
    },
  },
  ngo_mail: {
    type: String,
    validate: {
      validator: async function (value) {
        if (this.role === "Volunteer") {
          const ngoUser = await User.findOne({ email: value });
          return !!ngoUser; // Ensures NGO email exists
        }
        return true; // If not Volunteer, no validation needed
      },
      message: "The provided NGO email does not exist.",
    },
  },
  darpan_id: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.role === "NGO") {
          return darpanRegex.test(value);
        }
        return true; // No validation needed for non-NGOs
      },
      
      message: "Invalid Darpan ID format.",
    },
  },
  image_url: {
    type: String, // This will store the Cloudinary image URL // Make it mandatory for the user to upload an image
  },
  isApproved: { type: Boolean, default: false },
   // New field for approval status
},{timestamps:true});


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Use environment variable for Razorpay Test Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Use environment variable for Razorpay Test Secret Key
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
  createdAt: { type: Date, default: Date.now }, // Track when the donation is created
  acceptedAt: { type: Date }, // Track when the donation is accepted
  deliveredAt: { type: Date }, // Track when the donation is delivered
  donorEmail: { type: String, required: true },
  peopleFed: { type: Number, required: true },
  contact: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: false },  // Add description field
  coordinates: { type: [Number], required: true }, // Store coordinates
  status: { type: String, default: "Pending" },  
  foodQuality: {
    type: String,
    default: 'Not Checked', 
  },
  ngoDetails: {
    ngoName: { type: String },  // Optional field
    ngoEmail: { type: String }, // Optional field
    ngoContact: { type: String }, // Optional field
  },
  rating: { type: Number, default: 0 }, // Add this if missing
});

DonationSchema.index({ "ngoDetails.ngoEmail": 1, status: 1 });



// Define Image Schema
const imageSchema = new mongoose.Schema({
  imageUrl: String,
},{timestamps:true});
const Image = mongoose.model("Image", imageSchema);

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

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static("uploads"));

// Upload Route
app.post("/api/users/upload", upload.single("image"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
      }

      const newImage = new Image({ imageUrl: `/uploads/${req.file.filename}` });
      await newImage.save();

      res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: newImage.imageUrl,
      });
  } catch (error) {
      res.status(500).json({ message: "Error uploading image", error });
  }
});
// Add geospatial indexes
// DonationSchema.index({ donorLocation: "2dsphere" });
// DonationSchema.index({ volunteerLocation: "2dsphere" });


const Donation = mongoose.model("Donation", DonationSchema);

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  ngoEmail: { type: String },
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

// POST route for signup

app.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { name, username, email, password, role, address, ngo_mail, darpanId } = req.body;

    if (role === "NGO" && (!darpanId || !/^(AP|AR|AS|BR|CG|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB)\/\d{4}\/\d{7}$/.test(darpanId))) {
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
    // console.error("❌ Signup error:", error);
    // res.status(500).json({ message: "Error registering user" });
  }
});

app.get("/pending-volunteers/:ngoEmail", async (req, res) => {
  try {
    const { ngoEmail } = req.params;
    const pendingVolunteers = await User.find({ ngo_mail: ngoEmail, role: "Volunteer", isApproved: false });

    res.status(200).json(pendingVolunteers);
  } catch (error) {
    console.error("Error fetching pending volunteers:", error);
    res.status(500).json({ message: "Error fetching pending volunteers" });
  }
});

app.post("/approve-volunteer", async (req, res) => {
  try {
    const { volunteerId, approve } = req.body;
    const volunteer = await User.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    if (approve) {
      volunteer.isApproved = true;
      await volunteer.save();
      return res.status(200).json({ message: "Volunteer approved successfully" });
    } else {
      await User.findByIdAndDelete(volunteerId);
      return res.status(200).json({ message: "Volunteer rejected successfully" });
    }
  } catch (error) {
    console.error("Error approving/rejecting volunteer:", error);
    res.status(500).json({ message: "Error processing request" });
  }
});



const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use environment variable for Google Client ID

app.post('/auth/google', async (req, res) => {
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
});



// ✅ Login Route
app.post("/login", async (req, res) => {
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

    await notification.save();

    const ngoEmail = donation.ngoEmail;
    const message1 = `Volunteer is on the Way! The volunteer is now heading towards donor location.`;

    const notification1 = new Notification({
      ngoEmail,
      message1,
    });

    await notification1.save();
    
    // Save the donation with updated location
    await donation.save();

    res.status(200).json({ message: "Donation marked for delivery and notification sent" });

  } catch (error) {
    console.error("❌ Error delivering donation:", error);
    res.status(500).json({ message: "Error delivering donation" });
  }
});

const router = express.Router();

// Get notifications for an NGO
router.get("/notifications/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({ recipientEmail: email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
});

module.exports = router;


// ✅ Donor - Submit Food Donation
app.post("/donate", authenticateRole(["Donor"]), async (req, res) => {
  try {
    const { donorEmail, peopleFed, contact, expiryDate, location, description } = req.body;

    // Validate all required fields
    if (!donorEmail || !peopleFed || !contact || !expiryDate || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
      description, // Ensure description is stored
      status: "Pending",
    });

    await newDonation.save();

    res.status(201).json({ message: "Donation submitted successfully!", donation: newDonation });
  } catch (error) {
    console.error("Error saving donation:", error);
    res.status(500).json({ message: "Failed to submit donation. Please try again." });
  }
});



// Admin route to get unapproved NGOs
app.get("/admin/ngos", async (req, res) => {
  try {
    const ngos = await User.find({ role: "NGO", isApproved: false });
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs" });
  }
});

// Admin route to approve an NGO
app.post("/admin/approve-ngo/:ngoId", async (req, res) => {
  try {
    const ngo = await User.findById(req.params.ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    ngo.isApproved = true;
    await ngo.save();
    res.status(200).json({ message: "NGO approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving NGO" });
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
app.post("/rate-donation", authenticateRole(["NGO"]), async (req, res) => {
  try {
    console.log("🔹 Incoming Request Body:", req.body);
    const { donationId, rating } = req.body;

    // Validate rating input
    if (!donationId || rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating input" });
    }

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    // Find donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Ensure the logged-in NGO accepted the donation
    if (donation.ngoDetails.ngoEmail !== req.user.email) {
      return res.status(403).json({ message: "You cannot rate this donation" });
    }

    // Update only the donation's rating
    donation.rating = rating;
    await donation.save();

    res.status(200).json({ 
      message: "Donation rating updated successfully", 
      donation 
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Error rating donation", error: error.message });
  }
});




// const handleFoodQualityCheck = async (donationId) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.post(
//       "http://localhost:5000/food-quality-check",
//       { donationId, quality: "Good" },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     console.log("response:..",response.data);
//     alert(response.data.message);
//   } catch (err) {
//     alert("Failed to mark food quality. Please try again.");
//   }
// };
app.post('/food-quality-check', async (req, res) => {
  const { donationId, quality } = req.body;
  console.log("Received food quality check:", { donationId, quality });

  // Your logic for handling the donation update
  const donation = await Donation.findById(donationId);
  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  // Updating the donation food quality
  donation.foodQuality = quality;
  await donation.save();
  res.status(200).json({ message: 'Food quality checked and marked as good.' });
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
