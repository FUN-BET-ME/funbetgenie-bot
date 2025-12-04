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

// Health check
app.get("/", (req, res) => {
  res.send("FunBetGenie bot is running!");
});

// Telegram webhook
// Make sure your setWebhook URL ends with /webhook/funbetgenie
// Example:
// https://funbetgeniebot-8j268.ondigitalocean.app/webhook/funbetgenie
app.post("/webhook/funbetgenie", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const rawText = msg.text || "";
  const text = rawText.trim();
  const lower = text.toLowerCase();

  console.log("Incoming message:", JSON.stringify(msg));

  try {
    if (lower === "/start" || lower === "start") {
      await sendStart(chatId);
    } else if (lower === "/bonus" || lower === "bonus") {
      await sendBonus(chatId);
    } else if (lower === "/claim" || lower === "claim") {
      await sendClaim(chatId);
    } else if (lower === "/help" || lower === "help") {
      await sendHelp(chatId);
    } else if (lower === "/odds" || lower === "odds" || lower.includes("odds")) {
      await sendOdds(chatId);
    } else {
      await sendFallback(chatId);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err?.response?.data || err?.message || err);
    return res.sendStatus(200);
  }
});

// =====================
//  Helper responses
// =====================

async function sendStart(chatId) {
  const msg = `
Welcome to FunBet Genie! 🎩

I’m here to guide you to FunBet.Me and help you discover the best bonuses.

Current highlights:
• Sign-up No Deposit Bonus
• First Deposit Bonus for Casino & Sports
• Boosted odds and regular promotions

Start your journey here:
https://funbet.me/

You can also type:
• /bonus  – see our promotions page
• /claim  – how your bonuses work
• /odds   – check live odds and stats on FunBet.AI
• /help   – go to FunBet.Me for support
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendBonus(chatId) {
  const msg = `
🎁 FunBet.Me Promotions

Visit our official promotions page for:
• Sign-up No Deposit Bonus
• First Deposit Bonus
• Ongoing casino and sports offers

We keep wagering requirements low and bonuses fair so you can enjoy more play and more chances to win.

Check the latest offers here:
https://funbet.me/en/promotions

When you're ready to play:
https://funbet.me/
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendClaim(chatId) {
  const msg = `
How to claim your FunBet bonuses:

1) Sign-up No Deposit Bonus:
• Register a new account on FunBet.Me.
• Your no-deposit bonus is added automatically according to the current promotion.
• Just log in and check your balance/bonus section.

2) First Deposit Bonus:
• Make your first deposit on FunBet.Me.
• The bonus is applied based on the promotion rules (amount, game type, wagering and max win).
• Full details are always on the promotions page.

Start or continue here:
https://funbet.me/

For any questions about your specific account or bonus, please contact support on FunBet.Me using the live chat.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendHelp(chatId) {
  const msg = `
For support, account questions, deposits, withdrawals or detailed bonus help, please visit our website and use the live chat.

Go to FunBet.Me:
https://funbet.me/

Our team is available via the site chat to assist you directly.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendOdds(chatId) {
  const msg = `
Want to check stats, odds and match information?

Visit our analytics and odds companion:
https://funbet.ai/

Use FunBet.AI to compare odds, analyse games and then place your bets on:
https://funbet.me/
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
  });
}

async function sendFallback(chatId) {
  const msg = `
I didn’t understand that.

You can use:
• /start  – welcome and main info
• /bonus  – see promotions
• /claim  – how to claim bonuses
• /odds   – go to FunBet.AI
• /help   – go to FunBet.Me for support

Or visit:
https://funbet.me/
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
