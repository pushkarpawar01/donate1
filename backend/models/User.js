const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, enum: ["Donor", "NGO"], required: true }, // New field
});

module.exports = mongoose.model("User", UserSchema);
