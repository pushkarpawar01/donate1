import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";

router.post("/auth/google", authController.googleAuth);
router.post("/login", authController.login);

export default router;
