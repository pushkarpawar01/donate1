import mongoose from "mongoose";
const darpanRegex = /^(AP|AR|AS|BR|CG|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB)\/\d{4}\/\d{7}$/;

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
          const ngoUser = await mongoose.model("User").findOne({ email: value });
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

const User = mongoose.model("User", UserSchema);
export default User;
