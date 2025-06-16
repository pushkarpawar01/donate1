import Notification from "../models/Notification.js";

const getNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({ recipientEmail: email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
};

const getDonorNotifications = async (req, res) => {
  try {
    const donorEmail = req.user.email; // Get donor's email from token

    const notifications = await Notification.find({ donorEmail }).sort({ date: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

const markNotificationRead = async (req, res) => {
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
};

const clearAllNotifications = async (req, res) => {
  try {
    const donorEmail = req.user.email; // Get donor's email from token

    // Delete all notifications related to the donor
    await Notification.deleteMany({ donorEmail });

    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("❌ Error clearing notifications:", error);
    res.status(500).json({ message: "Error clearing notifications" });
  }
};

const deleteNotification = async (req, res) => {
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
};

export default {
  getNotifications,
  getDonorNotifications,
  markNotificationRead,
  clearAllNotifications,
  deleteNotification,
};
