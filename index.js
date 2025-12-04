import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// =====================
//  CONFIG
// =====================

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN is not set in environment variables.");
}

const API = `https://api.telegram.org/bot${TOKEN}`;

// =====================
//  ROUTES
// =====================

// Health check
app.get("/", (req, res) => {
  res.send("FunBetGenie Bot is running!");
});

// Telegram webhook
app.post("/webhook/funbetgenie", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase().trim();

  console.log("Incoming message:", msg);

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

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err?.response?.data || err.message);
    return res.sendStatus(200);
  }
});

// =====================
//  FUNCTIONS — NO MARKDOWN = NO ERRORS
// =====================

async function sendWelcome(chatId) {
  const url = "https://funbet.me/?utm_source=telegram&utm_medium=genie&utm_campaign=bot&utm_id=genie_bot";

  const msg =
`Welcome to FunBet Genie!

Your exclusive launch bonus:
Get €20 / ₹1000 Free – No Deposit Required.

10x wagering • Max win €400 • Casino or Sports.

Tap below to create your FunBet account:
${url}

After signup, return here and type CLAIM to activate your bonus.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg
  });
}

async function sendClaimInstructions(chatId) {
  const msg =
`Bonus Activation:

Please reply with the email address you used to register on FunBet.Me.

Example:
myemail@example.com

This is required to activate your €20 / ₹1000 free bonus.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg
  });
}

async function sendHelp(chatId) {
  const msg =
`FunBet Genie Help:

/start  - Start your bonus journey
CLAIM   - Activate your €20 / ₹1000 free bonus
help    - Show this help menu

More features coming soon!
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg
  });
}

async function sendUnknown(chatId) {
  const msg =
`I didn’t understand that.

Commands:
/start
CLAIM
help
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg
  });
}

// =====================
//  START SERVER
// =====================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`FunBetGenie running on port ${PORT}`);
});
