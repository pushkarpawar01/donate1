import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";

router.post("/validate-ngo-email", userController.validateNgoEmail);
router.post("/signup", userController.upload.single("image"), userController.signup);

export default router;
