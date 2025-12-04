// index.js

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// =====================
//  Config
// =====================

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN is not set in environment variables.");
}

const API = `https://api.telegram.org/bot${TOKEN}`;

// =====================
//  Routes
// =====================

// Simple health check
app.get("/", (req, res) => {
  res.send("FunBetGenie bot is running on DigitalOcean App Platform!");
});

// Telegram webhook
// Make sure your setWebhook URL ends with /webhook to match this
// e.g. https://funbetgeniebot-8j268.ondigitalocean.app/webhook
app.post("/webhook", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const lower = text.toLowerCase();

  console.log("Incoming message:", JSON.stringify(msg));

  try {
    if (lower === "/start" || lower === "start") {
      await sendWelcome(chatId);
    } else if (lower === "claim" || lower === "/claim") {
      await sendClaimInfo(chatId);
    } else if (lower === "/help" || lower.includes("help")) {
      await sendHelp(chatId);
    } else {
      await sendUnknown(chatId);
    }

    // Always acknowledge Telegram fast
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err?.response?.data || err?.message || err);
    // Reply 200 so Telegram doesn't keep retrying
    return res.sendStatus(200);
  }
});

// =====================
//  Helper functions
// =====================

async function sendWelcome(chatId) {
  const url =
    "https://funbet.me/?utm_source=telegram&utm_medium=genie&utm_campaign=bot&utm_id=genie_bot";

  const msg = `
Welcome to FunBet Genie! 🎩✨

Your exclusive launch bonus:
➡️ Get €20 / ₹1000 Free – No Deposit Required.

• 10× wagering
• Max win €400
• Use on Casino or Sports

1️⃣ Tap this link to create YOUR FunBet.Me account:
${url}

2️⃣ Once you have finished registration, come back here and type:

CLAIM

to get tips, reminders and updates about your bonus.
Your bonus is automatically added to your account when you sign up with this link.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendClaimInfo(chatId) {
  const msg = `
Great! 🎉

If you registered on FunBet.Me using the link from this chat:

✅ Your €20 / ₹1000 free bonus is automatically added to your FunBet.Me account.
You don’t need to send your email or do anything extra in Telegram.

Just log in to FunBet.Me, check your balance and start playing.
If you don't see the bonus, contact support from the FunBet.Me website.

I’ll also send you occasional:
• Boosted odds info
• Hot casino picks
• VIP / promo updates

Type /help anytime to see what I can do.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendHelp(chatId) {
  const msg = `
FunBet Genie Commands:

/start  – Get your signup link and bonus info
CLAIM   – Info about your bonus after you register
/help   – Show this help message again

Remember: your bonus is credited automatically when you register on FunBet.Me using the link I send you.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendUnknown(chatId) {
  const msg = `
I didn't understand that.

You can use:
/start  – Begin and get your signup link
CLAIM   – Info about your bonus
/help   – Show commands
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

// =====================
//  Start server
// =====================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`FunBetGenie running on port ${PORT}`);
});
