import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // ✅ Optional: Save to MongoDB
    // const contact = new Contact({ name, email, company, message });
    // await contact.save();

    // Nodemailer using Gmail SMTP with SSL
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: 587,                    // TLS port
  secure: false,                // false for TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password
  },
});

    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,    // receive email in the same Gmail
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("Email sent successfully via Gmail SMTP!");
    res.status(200).json({ success: true, message: "Email sent successfully!" });

  } catch (err) {
    console.error("SMTP / Server error:", err);
    res
      .status(500)
      .json({ success: false, message: "Email sending failed: " + err.message });
  }
});

export default router;
