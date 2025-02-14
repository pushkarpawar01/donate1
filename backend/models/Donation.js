const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  donorEmail: String,
  amount: Number,
  expiryDate: Date,
  contact: String,
  location: String,
  status: { type: String, default: "Pending" }, // Pending, Accepted, Declined
  ngoDetails: {
    ngoName: String,
    ngoEmail: String,
    ngoContact: String,
  },
});

const Donation = mongoose.model("Donation", DonationSchema);
module.exports = Donation;
