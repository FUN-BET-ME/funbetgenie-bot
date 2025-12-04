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

const SAFE_TOKEN = encodeURIComponent(TOKEN || "");
const API = `https://api.telegram.org/bot${TOKEN}`;

// =====================
//  Routes
// =====================

// Health check
app.get("/", (req, res) => {
  res.send("FunBetGenie is running on DigitalOcean App Platform!");
});

// Telegram webhook – NOTE: uses SAFE_TOKEN in the path
app.post(`/webhook/${SAFE_TOKEN}`, async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  try {
    if (text === "/start") {
      await sendWelcome(chatId);
    } else if (text === "claim") {
      await sendClaimInstructions(chatId);
    } else if (text.includes("help")) {
      await sendHelp(chatId);
    } else {
      await sendUnknown(chatId);
    }

    // Always acknowledge Telegram quickly
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err?.message || err);
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
🎉 *Welcome to FunBet Genie!*

🔥 Your exclusive launch bonus:
💰 *Get €20 / ₹1000 Free – No Deposit Required*

10× wagering • Max win €400 • Use on Casino or Sports

👉 Tap to create your FunBet account:
${url}

After signup, return here and type *CLAIM* to activate your bonus.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function sendClaimInstructions(chatId) {
  const msg = `
🎁 *Bonus Activation – One Last Step*

Please reply with the *email address* you used to register on FunBet.Me.

Example:
\`myemail@example.com\`

(I'll use this to check your account and activate your €20 / ₹1000 free bonus.)
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function sendHelp(chatId) {
  const msg = `
💡 *FunBet Genie Commands*

/start  - Begin your bonus journey  
CLAIM   - Activate your €20 / ₹1000 free bonus  
help    - Show this help menu

Soon I'll also send boosted odds, hot casino picks, and VIP offers directly here in Telegram.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function sendUnknown(chatId) {
  const msg = `
I didn’t understand that.

Type:
/start  to begin  
CLAIM   to activate your bonus  
help    to see commands
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
