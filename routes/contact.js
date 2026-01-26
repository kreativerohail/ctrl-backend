import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import connectDB from "../lib/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await connectDB();

    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1️⃣ Test MongoDB save
    let contact;
    try {
      contact = new Contact({ name, email, company, message });
      await contact.save();
      console.log("Saved to MongoDB:", contact);
    } catch (dbErr) {
      console.error("MongoDB save error:", dbErr);
      return res.status(500).json({ success: false, message: "MongoDB save failed: " + dbErr.message });
    }

    // 2️⃣ Test sending email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // App Password
        },
      });

      await transporter.sendMail({
        from: `"Website Contact" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
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

      console.log("Email sent successfully");
    } catch (mailErr) {
      console.error("Nodemailer error:", mailErr);
      return res.status(500).json({ success: false, message: "Email sending failed: " + mailErr.message });
    }

    // 3️⃣ Success response
    res.status(200).json({ success: true, message: "Message saved and email sent successfully" });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, message: "Unexpected server error: " + err.message });
  }
});

export default router;
