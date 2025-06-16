import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Donation from "../models/Donation.js";

const getPendingVolunteers = async (req, res) => {
  try {
    const { ngoEmail } = req.params;
    const pendingVolunteers = await User.find({ ngo_mail: ngoEmail, role: "Volunteer", isApproved: false });

    res.status(200).json(pendingVolunteers);
  } catch (error) {
    console.error("Error fetching pending volunteers:", error);
    res.status(500).json({ message: "Error fetching pending volunteers" });
  }
};

const approveVolunteer = async (req, res) => {
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
};

const volunteerDeliverDonation = async (req, res) => {
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

    const ngoEmail = donation.ngoEmail;
    const message1 = `Volunteer is on the Way! The volunteer is now heading towards donor location.`;

    const notification1 = new Notification({
      ngoEmail,
      message: message1,
    });

    await notification1.save();
    
    // Save the donation with updated location
    await donation.save();

    res.status(200).json({ message: "Donation marked for delivery and notification sent" });

  } catch (error) {
    console.error("❌ Error delivering donation:", error);
    res.status(500).json({ message: "Error delivering donation" });
  }
};

export default {
  getPendingVolunteers,
  approveVolunteer,
  volunteerDeliverDonation,
};
