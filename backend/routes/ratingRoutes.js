import express from "express";
import { rateProperty, getPropertyRatings } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", rateProperty);
router.get("/:propertyId", getPropertyRatings);

export default router;