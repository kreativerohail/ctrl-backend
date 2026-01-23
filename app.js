import express from "express";
import dotenv from "dotenv";
import contactRoute from "./routes/contact.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS setup for Vercel frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://ctrl4-wiqi.vercel.app", // tumhara frontend
    "http://localhost:5173"           // local testing ke liye
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Routes
app.use("/api/contact", contactRoute);

export default app;
