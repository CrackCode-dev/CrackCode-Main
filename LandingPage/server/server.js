import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3001; 

// Middleware
app.use(cors({
    origin: 'http://localhost:5173' // Allow your frontend to communicate
}));
app.use(express.json());

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('Server is ready to take our messages: ERROR', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// POST endpoint to handle contact form
app.post('/api/contact', async (req, res) => {
    const { email, message } = req.body;

    // 1. Validation
    if (!email || !message) {
        return res.status(400).json({ success: false, message: "Email and message are required." });
    }

    // 2. Email Options
    const mailOptions = {
        from: email, // The user's email (sender)
        to: process.env.EMAIL_USER, // YOUR email (receiver)
        subject: `New Contact Form Message from ${email}`,
        text: `You have a new message from CrackCode Contact Form:\n\nFrom: ${email}\n\nMessage:\n${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>From:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #f97316;">${message}</blockquote>
        `
    };

    // 3. Send Email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully from ${email}`);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});