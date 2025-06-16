import express from "express";
const router = express.Router();
import donationController from "../controllers/donationController.js";
import { authenticateRole } from "../middlewares/auth.js";

router.post("/donate", authenticateRole(["Donor"]), donationController.donate);
router.post("/update-donation", authenticateRole(["NGO"]), donationController.updateDonation);
router.post("/rate-donation", authenticateRole(["NGO"]), donationController.rateDonation);
router.post("/food-quality-check", donationController.foodQualityCheck);

router.get("/ngo-donations", authenticateRole(["NGO"]), donationController.getPendingDonations);
router.get("/ngo-acceptedDonations", authenticateRole(["NGO"]), donationController.getAcceptedDonations);

export default router;
