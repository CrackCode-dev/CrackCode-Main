import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; 

// Load env variables from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const transporter = nodemailer.createTransport({ // configure the transporter with SMTP settings from environment variables
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
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

