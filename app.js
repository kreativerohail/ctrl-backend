import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./lib/db.js";
import contactRoute from "./routes/contact.js";

dotenv.config();

const app = express();

// 🔹 Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contact", contactRoute);

export default app;
