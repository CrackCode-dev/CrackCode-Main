import { sendTransactionalEmail } from "./brevo.client.js";

// Admin-protected endpoint to send a test/transactional email via Brevo
export const sendTestEmail = async (req, res) => {
  try {
    // Admin check: require ADMIN_EMAILS (csv) or single ADMIN_EMAIL in env
    const adminCsv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL;
    if (!adminCsv) {
      return res.status(403).json({ success: false, message: "ADMIN_EMAILS not configured on server" });
    }

    const admins = adminCsv.split(",").map((s) => s.trim().toLowerCase());
    const requester = (req.user?.email || "").toLowerCase();
    if (!admins.includes(requester)) {
      return res.status(403).json({ success: false, message: "Forbidden: admin only" });
    }

    const { to = process.env.DEBUG_EMAIL_TO || "info.crackcode@gmail.com", subject = "Test from Brevo", html } = req.body;

    const senderEmail = process.env.SENDER_EMAIL;
    if (!senderEmail) {
      return res.status(500).json({ success: false, message: "SENDER_EMAIL not configured" });
    }

    const result = await sendTransactionalEmail({ to, subject, html, senderEmail });

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Brevo send error:", error?.response?.data || error.message || error);
    return res.status(500).json({ success: false, message: error?.response?.data || error.message || "Failed to send" });
  }
};

export default { sendTestEmail };
