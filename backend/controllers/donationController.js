import Donation from "../models/Donation.js";
import Notification from "../models/Notification.js";

const donate = async (req, res) => {
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

    // Expiry Date Validation (Must be at least 1 day later than today)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Remove time to compare only the date

    // Adjust for the timezone offset
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localDate = new Date(currentDate.getTime() - timezoneOffset);

    const minExpiryDate = new Date(localDate);
    minExpiryDate.setDate(localDate.getDate() + 1); // Expiry date must be at least tomorrow

    // Reject if expiry date is not at least 1 day later
    if (parsedExpiryDate < minExpiryDate) {
      return res.status(400).json({ message: "Expiry date must be at least one day after today." });
    }

    // Save the donation if all validations pass
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
};

const updateDonation = async (req, res) => {
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
};

const rateDonation = async (req, res) => {
  try {
    const { donationId, rating } = req.body;

    // Validate rating input
    if (!donationId || rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating input" });
    }

    if (!donationId.match(/^[0-9a-fA-F]{24}$/)) {
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
};

const foodQualityCheck = async (req, res) => {
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
};

const getPendingDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Pending" }).sort({ _id: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
};

const getAcceptedDonations = async (req, res) => {
  try {
    const ngoEmail = req.user.email;
    const donations = await Donation.find({
      "ngoDetails.ngoEmail": ngoEmail,
      status: "Accepted"
    }).populate('donorEmail', 'name email address contact') // populate donor details if donorEmail is a reference
    .select('donorEmail contact peopleFed location expiryDate status ngoDetails');
    res.status(200).json(donations);
  } catch (error) {
    console.error("❌ Error fetching accepted donations:", error);
    res.status(500).json({ message: "Error fetching accepted donations" });
  }
};

const getMyDonations = async (req, res) => {
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
};

export default {
  donate,
  updateDonation,
  rateDonation,
  foodQualityCheck,
  getPendingDonations,
  getAcceptedDonations,
  getMyDonations,
};
