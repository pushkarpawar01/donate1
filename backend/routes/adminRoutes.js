import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.js";

router.get("/admin/ngos", adminController.getUnapprovedNgos);
router.post("/admin/approve-ngo/:ngoId", adminController.approveNgo);

export default router;
