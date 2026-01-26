import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import connectDB from "../lib/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  // 🔹 Ensure MongoDB connection (IMPORTANT for Vercel)
  await connectDB();

  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Save to MongoDB
    const contact = new Contact({ name, email, company, message });
    await contact.save();

    // Send email (Gmail recommended)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <h2>New message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("❌ CONTACT ROUTE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});

export default router;
