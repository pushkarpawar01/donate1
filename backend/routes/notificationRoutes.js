import express from "express";
const router = express.Router();
import notificationController from "../controllers/notificationController.js";
import { authenticateRole } from "../middlewares/auth.js";

router.get("/notifications/:email", notificationController.getNotifications);
router.get("/donor-notifications", authenticateRole(["Donor"]), notificationController.getDonorNotifications);
router.post("/mark-notification-read", authenticateRole(["Donor"]), notificationController.markNotificationRead);
router.delete("/clear-all-notifications", authenticateRole(["Donor"]), notificationController.clearAllNotifications);
router.delete("/delete-notification", authenticateRole(["Donor"]), notificationController.deleteNotification);

export default router;
