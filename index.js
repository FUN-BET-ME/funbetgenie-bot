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
// Russia-only Genie bot
const TOKEN_RUSSIA = process.env.BOT_TOKEN_RUSSIA;
// Brazil-only Genie bot
const TOKEN_BRAZIL = process.env.BOT_TOKEN_BRAZIL;

if (!TOKEN_GENIE) {
  console.error("❌ BOT_TOKEN_GENIE is not set in environment variables.");
}
if (!TOKEN_INDIA) {
  console.error("❌ BOT_TOKEN_INDIA is not set in environment variables.");
}
if (!TOKEN_RUSSIA) {
  console.error("❌ BOT_TOKEN_RUSSIA is not set in environment variables.");
}
if (!TOKEN_BRAZIL) {
  console.error("❌ BOT_TOKEN_BRAZIL is not set in environment variables.");
}

const API_GENIE = TOKEN_GENIE
  ? `https://api.telegram.org/bot${TOKEN_GENIE}`
  : null;
const API_INDIA = TOKEN_INDIA
  ? `https://api.telegram.org/bot${TOKEN_INDIA}`
  : null;
const API_RUSSIA = TOKEN_RUSSIA
  ? `https://api.telegram.org/bot${TOKEN_RUSSIA}`
  : null;
const API_BRAZIL = TOKEN_BRAZIL
  ? `https://api.telegram.org/bot${TOKEN_BRAZIL}`
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

  try {
    return await axios.post(`${apiBase}/sendMessage`, payload);
  } catch (err) {
    console.error(
      "❌ Telegram send error:",
      err?.response?.data || err?.message || err
    );
  }
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

// =====================
//  RUSSIA GENIE BOT
//  webhook: /webhook/funbetrussia
// =====================

app.post("/webhook/funbetrussia", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim().toLowerCase();

  try {
    console.log("🇷🇺 Russia bot incoming:", JSON.stringify(msg));

    if (text === "/start" || text === "start") {
      await genieRussiaStart(chatId);
    } else if (text === "/bonus" || text === "bonus") {
      await genieRussiaBonus(chatId);
    } else if (text === "/claim" || text === "claim") {
      await genieRussiaClaim(chatId);
    } else if (text === "/help" || text === "help") {
      await genieRussiaHelp(chatId);
    } else if (text === "odds" || text === "/odds") {
      await genieRussiaOdds(chatId);
    } else {
      await genieUnknown(chatId, API_RUSSIA);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("🇷🇺 Russia bot webhook error:", err?.message || err);
    return res.sendStatus(200);
  }
});

// ===== Russia bot message builders =====

async function genieRussiaStart(chatId) {
  const msg = `
🇷🇺 *Добро пожаловать в FunBetMe Genie — Россия!*

Вот ваши актуальные бонусы:

🎁 *Бонус за регистрацию — ₽1000!*
• Без депозита  
• Выигрывай до 20× → *₽20 000*  
• *20× отыгрыш*  
• Промокод: *FBM20*

🔥 *400% бонус на первый депозит*
• Пополни на ₽100 → играй с ₽500  
• Бонус для Казино и Спорта  
• *20× отыгрыш*  
• Максимальный депозит: *₽100 000*  
• Промокод: *FD400*

👉 Нажмите, чтобы открыть FunBet.Me:  
${FUNBET_SITE}

Вы анализируете. Вы решаете.  
*Ваше мастерство. Ваш выигрыш!*
`;

  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieRussiaBonus(chatId) {
  const msg = `
🎁 *Текущие бонусы FunBet.Me — Россия*

🎉 *₽1000 за регистрацию*
• Без депозита  
• До ₽20 000 выигрыша  
• 20× отыгрыш  
• Код: *FBM20*

🔥 *400% бонус на первый депозит*
• Пополни на ₽100 → играй с ₽500  
• Казино + Спорт  
• 20× отыгрыш  
• Макс. депозит: ₽100 000  
• Код: *FD400*

Все акции здесь:  
${FUNBET_PROMOS}
`;

  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieRussiaClaim(chatId) {
  const msg = `
✅ *Как получить ваши бонусы:*

1. Зарегистрируйтесь на FunBet.Me  
2. Введите промокоды в разделе «Бонусы»  
3. Бонусы будут начислены автоматически после выполнения условий  

🎁 Регистрация → *₽1000 бесплатно* (FBM20)  
🔥 Первый депозит → *400% бонус* (FD400)

🌐 ${FUNBET_SITE}
`;

  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieRussiaHelp(chatId) {
  const msg = `
💡 *Команды FunBetMe Genie — Россия*

/start — приветствие и обзор бонусов  
/bonus — текущие бонусы  
/claim — как получить бонусы  
/help — список команд  
/odds — сравнение коэффициентов  

🌐 Сайт: ${FUNBET_SITE}  
📊 Статистика: ${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieRussiaOdds(chatId) {
  const msg = `
📊 *Сравнение коэффициентов и статистика*

Откройте FunBet.AI:
${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

// =====================
//  BRAZIL GENIE BOT
//  webhook: /webhook/funbetbrazil
// =====================

app.post("/webhook/funbetbrazil", async (req, res) => {
  const msg = req.body.message;

  if (!msg || !msg.chat) {
    return res.sendStatus(200);
  }

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim().toLowerCase();

  try {
    console.log("🇧🇷 Brazil bot incoming:", JSON.stringify(msg));

    if (text === "/start" || text === "start") {
      await genieBrazilStart(chatId);
    } else if (text === "/bonus" || text === "bonus") {
      await genieBrazilBonus(chatId);
    } else if (text === "/claim" || text === "claim") {
      await genieBrazilClaim(chatId);
    } else if (text === "/help" || text === "help") {
      await genieBrazilHelp(chatId);
    } else if (text === "odds" || text === "/odds") {
      await genieBrazilOdds(chatId);
    } else {
      await genieUnknown(chatId, API_BRAZIL);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("🇧🇷 Brazil bot webhook error:", err?.message || err);
    return res.sendStatus(200);
  }
});

// ===== Brazil bot message builders =====

async function genieBrazilStart(chatId) {
  const msg = `
🇧🇷 *Bem-vindo ao FunBetMe Genie – Brasil!*

🔥 *Super Bônus de Cadastro: R$100!*
• Nenhum depósito necessário  
• Ganhe até 20× → *R$2.000*  
• Apenas *10×* de aposta exigida  
• Código: *FBM20*

💰 *Bônus no Primeiro Depósito: 400%*
• Deposite *R$10* → jogue com *R$50*  
• Válido para Cassino e Esportes  
• *20×* de aposta exigida  
• Depósito máximo: *R$10.000*  
• Código: *FD400*

👉 Toque aqui para abrir FunBet.Me:  
${FUNBET_SITE}
`;

  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieBrazilBonus(chatId) {
  const msg = `
🎁 *Bônus Atuais – Brasil*

🎉 *R$100 de Cadastro – Sem Depósito*
• Até R$2.000 em ganhos  
• Apenas 10× de rollover  
• Código: *FBM20*

🔥 *400% no Primeiro Depósito*
• Deposite R$10 → jogue com R$50  
• Cassino + Esportes  
• 20× de rollover  
• Depósito máximo: R$10.000  
• Código: *FD400*

Veja os detalhes completos em:  
${FUNBET_PROMOS}
`;

  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieBrazilClaim(chatId) {
  const msg = `
✅ *Como ativar seus bônus no Brasil*

1. Acesse FunBet.Me e crie sua conta  
2. Use os códigos *FBM20* (cadastro) e *FD400* (primeiro depósito)  
3. Siga as regras da página de Promoções  
4. Os bônus serão creditados automaticamente após cumprir os requisitos

🌐 ${FUNBET_SITE}
`;

  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieBrazilHelp(chatId) {
  const msg = `
💡 *Comandos do FunBetMe Genie – Brasil*

/start  – Boas-vindas + visão geral dos bônus  
/bonus  – Ver bônus de cadastro e primeiro depósito  
/claim  – Como receber seus bônus  
/help   – Lista de comandos  
/odds   – Abrir FunBet.AI (odds e estatísticas)

🌐 Site: ${FUNBET_SITE}  
📊 Odds & stats: ${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieBrazilOdds(chatId) {
  const msg = `
📊 *FunBet.AI – Odds & Análises para o Brasil*

Compare odds e analise estatísticas aqui:  
${FUNBET_ODDS}
`;

  return sendTelegramMessage(API_BRAZIL, {
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
