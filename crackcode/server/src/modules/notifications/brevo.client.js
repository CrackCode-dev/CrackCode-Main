import axios from "axios";

const BREVO_API = "https://api.brevo.com/v3/smtp/email";

function getApiKey() {
  return process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.SIB_API_KEY;
}

// Verify API key by requesting account info. Returns true if reachable.
export async function verifyBrevoApiKey() {
  const apiKey = getApiKey();
  if (!apiKey) return false;

  try {
    const res = await axios.get("https://api.brevo.com/v3/account", {
      headers: { "api-key": apiKey },
      timeout: 5000,
    });
    return res.status === 200;
  } catch (err) {
    return false;
  }
}

export async function sendTransactionalEmail({ to, subject, html, text, senderEmail }) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured in environment");
  }

  const payload = {
    sender: { email: senderEmail || process.env.SENDER_EMAIL },
    to: Array.isArray(to) ? to.map((t) => ({ email: t })) : [{ email: to }],
    subject: subject || "No subject",
    htmlContent: html || text || "",
  };

  const res = await axios.post(BREVO_API, payload, {
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  return res.data;
}

export default { sendTransactionalEmail };
