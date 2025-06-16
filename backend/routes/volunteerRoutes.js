import express from "express";
const router = express.Router();
import volunteerController from "../controllers/volunteerController.js";
import { authenticateRole } from "../middlewares/auth.js";

router.get("/pending-volunteers/:ngoEmail", volunteerController.getPendingVolunteers);
router.post("/approve-volunteer", volunteerController.approveVolunteer);
router.post("/volunteer-deliver-donation", authenticateRole(["Volunteer"]), volunteerController.volunteerDeliverDonation);

export default router;
