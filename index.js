import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// =====================
//  Config
// =====================

// Global / main Genie bot
const TOKEN_GENIE = process.env.BOT_TOKEN_GENIE;
// India-only Genie bot
const TOKEN_INDIA = process.env.BOT_TOKEN_INDIA;

if (!TOKEN_GENIE) {
  console.error("❌ BOT_TOKEN_GENIE is not set in environment variables.");
}
if (!TOKEN_INDIA) {
  console.error("❌ BOT_TOKEN_INDIA is not set in environment variables.");
}

const API_GENIE = TOKEN_GENIE
  ? `https://api.telegram.org/bot${TOKEN_GENIE}`
  : null;
const API_INDIA = TOKEN_INDIA
  ? `https://api.telegram.org/bot${TOKEN_INDIA}`
  : null;

// Useful links
const FUNBET_SITE = "https://funbet.me/";
const FUNBET_PROMOS = "https://funbet.me/en/promotions";
const FUNBET_ODDS = "https://funbet.ai/";

// Small helper for sending messages
async function sendTelegramMessage(apiBase, payload) {
  if (!apiBase) {
    console.error("❌ Missing API base for Telegram send");
    return;
  }

  return axios.post(`${apiBase}/sendMessage`, payload);
}

// =====================
//  Health check
// =====================

app.get("/", (req, res) => {
  res.send("FunBet Genie multi-bot is running on DigitalOcean App Platform!");
});

// =====================
//  GLOBAL GENIE BOT
//  webhook: /webhook/funbetgenie
// =====================

app.post("/webhook/funbetgenie", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim().toLowerCase();

  try {
    console.log("🌍 Global bot incoming:", JSON.stringify(msg));

    if (text === "/start" || text === "start") {
      await genieGlobalStart(chatId);
    } else if (text === "/bonus" || text === "bonus") {
      await genieGlobalBonus(chatId);
    } else if (text === "/claim" || text === "claim") {
      await genieGlobalClaim(chatId);
    } else if (text === "/help" || text === "help") {
      await genieGlobalHelp(chatId);
    } else if (text === "odds" || text === "/odds") {
      await genieGlobalOdds(chatId);
    } else {
      await genieUnknown(chatId, API_GENIE);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("🌍 Global bot webhook error:", err?.message || err);
    return res.sendStatus(200);
  }
});

// ===== GLOBAL bot message builders =====

async function genieGlobalStart(chatId) {
  const msg = `
Welcome to *FunBet Genie* ✨

I'm here to guide you to FunBet.Me and help you discover the best bonuses and odds.

🔥 Current welcome offers (global):
• Free sign-up bonus (check country-specific value on the site)  
• First deposit bonus with low wagering  
• Access to casino, sports, and more

👉 Tap here to open FunBet.Me:
${FUNBET_SITE}

You analyse. You decide. *Your skill. Your win!*
`;

  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieGlobalBonus(chatId) {
  const msg = `
🎁 *FunBet.Me Promotions*

See all current sign-up, first deposit, and daily offers here:
${FUNBET_PROMOS}

FunBet.Me focuses on:
• Competitive odds  
• Low wagering where possible  
• Clear terms and transparent rewards  

Check your country-specific welcome offer on the promotions page.
`;

  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieGlobalClaim(chatId) {
  const msg = `
✅ *How to claim your bonuses*

1. Create your FunBet.Me account  
2. Complete the steps shown in the Promotions section  
3. Your eligible bonus will be automatically credited once conditions are met

If you need help, open our website and use Live Chat (Tawk) or Support.
${FUNBET_SITE}
`;

  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieGlobalHelp(chatId) {
  const msg = `
💡 *FunBet Genie Commands (Global)*

/start  – Welcome + main link  
/bonus  – Show promotions page  
/claim  – How to claim bonuses  
/help   – This menu  
odds    – Open FunBet.AI odds & stats

🌐 Website: ${FUNBET_SITE}
📊 Odds & stats: ${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieGlobalOdds(chatId) {
  const msg = `
📊 *FunBet.AI – Odds & Analysis*

Compare odds and analyse stats here:
${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

// =====================
//  INDIA GENIE BOT
//  webhook: /webhook/funbetindia
// =====================

app.post("/webhook/funbetindia", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim().toLowerCase();

  try {
    console.log("🇮🇳 India bot incoming:", JSON.stringify(msg));

    if (text === "/start" || text === "start") {
      await genieIndiaStart(chatId);
    } else if (text === "/bonus" || text === "bonus") {
      await genieIndiaBonus(chatId);
    } else if (text === "/claim" || text === "claim") {
      await genieIndiaClaim(chatId);
    } else if (text === "/help" || text === "help") {
      await genieIndiaHelp(chatId);
    } else if (text === "odds" || text === "/odds") {
      await genieIndiaOdds(chatId);
    } else {
      await genieUnknown(chatId, API_INDIA);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("🇮🇳 India bot webhook error:", err?.message || err);
    return res.sendStatus(200);
  }
});

// ===== India bot message builders =====

async function genieIndiaStart(chatId) {
  const msg = `
🇮🇳 *Welcome to FunBetMe Genie – India!*

I'm here to walk you through our Indian offers and send you to the right place.

🔥 *India launch bonuses*:
• ₹1,000 Free Sign-Up Bonus (no deposit needed)  
• 400% First Deposit Bonus  
• Only *20× wagering* on both bonuses  

👉 Tap here to open FunBet.Me and create your account:
${FUNBET_SITE}

Once you register and follow the promo steps, your bonuses will be
automatically credited inside your FunBet.Me account.
`;

  return sendTelegramMessage(API_INDIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieIndiaBonus(chatId) {
  const msg = `
🎁 *India Bonuses & Promotions*

For Indian players we currently offer:
• ₹1,000 Free Sign-Up Bonus  
• 400% First Deposit Bonus  
• 20× wagering on both bonuses  

Full details and any new offers are always here:
${FUNBET_PROMOS}

Make sure to read the terms on the site so you know exactly how to qualify.
`;

  return sendTelegramMessage(API_INDIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieIndiaClaim(chatId) {
  const msg = `
✅ *How to claim your India bonuses*

1. Go to FunBet.Me and register a new account  
2. Follow the steps on the Promotions page for India  
3. Your ₹1,000 sign-up and 400% first deposit bonus will be credited
   automatically once you meet the requirements  

Need help?  
Open the website and use Live Chat (Tawk) or Support from within the site.

🌐 ${FUNBET_SITE}
`;

  return sendTelegramMessage(API_INDIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieIndiaHelp(chatId) {
  const msg = `
💡 *FunBetMe Genie – India Commands*

/start  – Welcome + India offer overview  
/bonus  – Details of ₹1,000 sign-up & 400% first deposit bonus  
/claim  – How to get your bonuses credited  
/help   – This menu  
odds    – Open FunBet.AI odds & stats

🌐 Website: ${FUNBET_SITE}
📊 Odds & stats: ${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_INDIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieIndiaOdds(chatId) {
  const msg = `
📊 *FunBet.AI for Indian players*

Compare odds and analyse stats (football, cricket, etc.) here:
${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_INDIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

// ===== Shared fallback =====

async function genieUnknown(chatId, apiBase) {
  const msg = `
I didn't quite understand that.

Type one of these:
• /start  
• bonus  
• claim  
• help  
• odds
`;

  return sendTelegramMessage(apiBase, {
    chat_id: chatId,
    text: msg,
  });
}

// =====================
//  Start server
// =====================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`FunBet Genie multi-bot running on port ${PORT}`);
});
