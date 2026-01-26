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

app.get("/api/testdb", async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, message: "MongoDB connected!" });
  } catch (err) {
    console.error("MongoDB test error:", err);
    res.status(500).json({ success: false, message: "DB connection failed" });
  }
});


export default app;
