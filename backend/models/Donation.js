import mongoose from "mongoose";

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

const Donation = mongoose.model("Donation", DonationSchema);
export default Donation;
