import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  ngoEmail: { type: String },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }, // To track whether the donor has read the notification
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
