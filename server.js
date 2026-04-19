import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import legalRoute from "./routes/legal.js";
import riskRoute from "./routes/risk.js";
import complaintRoute from "./routes/complaint.js";
import govtRoute from "./routes/govt.js";
import lawyerRoute from "./routes/lawyer.js";

dotenv.config();

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== ROUTES ===== */
app.use("/api/legal", legalRoute);
app.use("/api/risk", riskRoute);
app.use("/api/complaint", complaintRoute);
app.use("/api/govt", govtRoute);
app.use("/api/lawyer", lawyerRoute);

/* ===== TEST ROUTE ===== */
app.get("/", (req, res) => {
    res.send("✅ ClaimMyRights Backend is Running");
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
