import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Attempt to send email using Gmail SMTP
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // Gmail App Password
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

      console.log("Email sent successfully via Gmail SMTP!");
      return res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (mailErr) {
      console.error("SMTP send error:", mailErr);
      return res.status(500).json({ success: false, message: "Email sending failed: " + mailErr.message });
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, message: "Unexpected server error: " + err.message });
  }
});

export default router;
