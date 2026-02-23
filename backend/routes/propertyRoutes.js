import express from "express";
import { createProperty, getProperties, deleteProperty, getSimilarProperties, upload } from "../controllers/propertyController.js";

const router = express.Router();

router.post("/", upload.single("image"), createProperty);
router.get("/", getProperties);
router.get("/similar/:id", getSimilarProperties);
router.delete("/:id", deleteProperty);


export default router;
