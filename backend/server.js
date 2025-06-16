import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Razorpay from "razorpay";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { authenticateRole } from "./middlewares/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static("uploads"));

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order route
app.post("/create-order", async (req, res) => {
  const { amount, ngoName } = req.body;

  if (!amount || !ngoName) {
    return res.status(400).json({ error: "Amount and NGO name are required" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
    });

    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use routes
app.use(userRoutes);
app.use(authRoutes);
app.use(donationRoutes);
app.use(volunteerRoutes);
app.use(notificationRoutes);
app.use(adminRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
