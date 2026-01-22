import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Save to MongoDB
    const contact = new Contact({ name, email, company, message });
    await contact.save();

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,  // Your inbox
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `<h2>New message from ${name}</h2>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Company:</strong> ${company || "N/A"}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`
    });

    res.status(200).json({ success: true, message: "Message sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
