import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contactRoute from "./routes/contact.js";

dotenv.config();

const app = express();

// Simple CORS: allow all origins
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use("/api/contact", contactRoute);

export default app;
