import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/ratings", ratingRoutes);




app.get("/", (req, res) => {
  res.send("EstateVault Backend Running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend connected successfully!" });
});



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
