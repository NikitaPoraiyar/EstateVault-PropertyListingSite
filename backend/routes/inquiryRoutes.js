import express from "express";
import { createInquiry, getBuyerInquiries, getSellerInquiries,} from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);
router.get("/buyer/:email", getBuyerInquiries);
router.get("/seller/:email", getSellerInquiries);

export default router;
