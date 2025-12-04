import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

app.get("/", (req, res) => {
  res.send("FunBetGenie is running on DigitalOcean App Platform!");
});

app.post(`/webhook/${TOKEN}`, async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  if (text === "/start") {
    await sendWelcome(chatId);
  } else if (text === "claim") {
    await sendClaimInstructions(chatId);
  } else if (text.includes("help")) {
    await sendHelp(chatId);
  } else {
    await sendUnknown(chatId);
  }

  res.sendStatus(200);
});

async function sendWelcome(chatId) {
  const url = "https://funbet.me/?utm_source=telegram&utm_medium=genie&utm_campaign=bot&utm_id=genie_bot";

  const msg = `
🎉 *Welcome to FunBet Genie!*

🔥 Your exclusive bonus:
💰 *Get €20 / ₹1000 Free – No Deposit Required*

10× wagering • Max win €400 • Use on Casino or Sports

👉 Tap to create your FunBet account:
${url}

After signup, return here and type *CLAIM*.
`;

  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function sendClaimInstructions(chatId) {
  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: "🎁 Please enter the *email address* you used on FunBet.Me so I can activate your bonus.",
    parse_mode: "Markdown"
  });
}

async function sendHelp(chatId) {
  const msg = `
💡 *FunBet Genie Commands*

/start - Begin bonus journey  
CLAIM - Activate your €20/₹1000 free bonus  
help - Show help menu
`;
  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function sendUnknown(chatId) {
  return axios.post(`${API}/sendMessage`, {
    chat_id: chatId,
    text: "I didn’t understand that. Type /start to begin.",
  });
}

// App Platform injects PORT env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FunBetGenie running on port ${PORT}`));
