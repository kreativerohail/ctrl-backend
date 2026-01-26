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
    // Optional: save to MongoDB if needed
    // const contact = new Contact({ name, email, company, message });
    // await contact.save();

    // Gmail SMTP using STARTTLS (Port 587, secure: false)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,  // smtp.gmail.com
      port: 587,                     // STARTTLS port
      secure: false,                 // must be false for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password from Gmail
      },
      tls: {
        ciphers: "SSLv3",            // optional, makes connection a bit less strict
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,      // receive in same Gmail
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `<h2>New message from ${name}</h2>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Company:</strong> ${company || "N/A"}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`
    });

    console.log("Email sent successfully via STARTTLS!");
    res.status(200).json({ success: true, message: "Email sent successfully!" });

  } catch (err) {
    console.error("Email sending error:", err);
    res
      .status(500)
      .json({ success: false, message: "Email sending failed: " + err.message });
  }
});

export default router;
