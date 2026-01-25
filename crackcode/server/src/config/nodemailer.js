import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // dev only
  },
});

// Debug logs
console.log("SMTP USER:", process.env.SMTP_USER);
console.log(
  "SMTP PASS:",
  process.env.SMTP_PASSWORD ? "LOADED" : "MISSING"
);

// Verify SMTP
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP verification failed:", error.message);
  } else {
    console.log("✅ SMTP ready to send emails");
  }
});

export default transporter;
