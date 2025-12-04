import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// =====================
//  Config – Tokens
// =====================

// Global / main Genie bot
const TOKEN_GENIE = process.env.BOT_TOKEN_GENIE;
// Country bots
const TOKEN_INDIA = process.env.BOT_TOKEN_INDIA;
const TOKEN_RUSSIA = process.env.BOT_TOKEN_RUSSIA;
const TOKEN_BRAZIL = process.env.BOT_TOKEN_BRAZIL;
const TOKEN_TURKEY = process.env.BOT_TOKEN_TURKEY;

if (!TOKEN_GENIE) console.error("❌ BOT_TOKEN_GENIE is not set.");
if (!TOKEN_INDIA) console.error("❌ BOT_TOKEN_INDIA is not set.");
if (!TOKEN_RUSSIA) console.error("❌ BOT_TOKEN_RUSSIA is not set.");
if (!TOKEN_BRAZIL) console.error("❌ BOT_TOKEN_BRAZIL is not set.");
if (!TOKEN_TURKEY) console.error("❌ BOT_TOKEN_TURKEY is not set.");

const API_GENIE = TOKEN_GENIE ? `https://api.telegram.org/bot${TOKEN_GENIE}` : null;
const API_INDIA = TOKEN_INDIA ? `https://api.telegram.org/bot${TOKEN_INDIA}` : null;
const API_RUSSIA = TOKEN_RUSSIA ? `https://api.telegram.org/bot${TOKEN_RUSSIA}` : null;
const API_BRAZIL = TOKEN_BRAZIL ? `https://api.telegram.org/bot${TOKEN_BRAZIL}` : null;
const API_TURKEY = TOKEN_TURKEY ? `https://api.telegram.org/bot${TOKEN_TURKEY}` : null;

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
    await axios.post(`${apiBase}/sendMessage`, payload);
  } catch (err) {
    console.error("❌ sendTelegramMessage error:", err?.response?.data || err.message);
  }
}

// =====================
//  Health check
// =====================

app.get("/", (req, res) => {
  res.send("FunBetMe multi-geo bot is running on DigitalOcean!");
});

// ======================================================
//  GLOBAL GENIE BOT
//  webhook: /webhook/funbetgenie
// ======================================================

app.post("/webhook/funbetgenie", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim().toLowerCase();

  try {
    console.log("🌍 Genie incoming:", JSON.stringify(msg));

    if (text === "/start" || text === "start") {
      await genieGlobalStart(chatId);
    } else if (text === "/bonus" || text === "bonus") {
      await genieGlobalBonus(chatId);
    } else if (text === "/claim" || text === "claim") {
      await genieGlobalClaim(chatId);
    } else if (text === "/help" || text === "help") {
      await genieGlobalHelp(chatId);
    } else if (text === "/odds" || text === "odds") {
      await genieGlobalOdds(chatId);
    } else {
      await genieUnknown(chatId, API_GENIE);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("🌍 Global bot webhook error:", err?.message || err);
    res.sendStatus(200);
  }
});

// ----- Global bot handlers -----

async function genieGlobalStart(chatId) {
  const msg = `
Welcome to *FunBetMe Genie* ✨

I'm here to guide you to FunBet.Me and help you discover the best bonuses and odds.

🔥 *Current welcome offers (global)*:
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
🎁 *FunBet.Me Promotions (Global)*

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
💡 *FunBetMe Genie Commands (Global)*

/start  – Welcome + main link  
/bonus  – Show promotions page  
/claim  – How to claim bonuses  
/help   – This menu  
/odds   – Open FunBet.AI odds & stats

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

// Shared fallback
async function genieUnknown(chatId, apiBase) {
  const msg = `
I didn't quite understand that.

Type one of these:
• /start  
• /bonus  
• /claim  
• /help  
• /odds
`;
  return sendTelegramMessage(apiBase, {
    chat_id: chatId,
    text: msg,
  });
}

// ======================================================
//  INDIA BOT – /webhook/funbetindia
// ======================================================

app.post("/webhook/funbetindia", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

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

    res.sendStatus(200);
  } catch (err) {
    console.error("🇮🇳 India bot webhook error:", err?.message || err);
    res.sendStatus(200);
  }
});

// ----- India messages -----

async function genieIndiaStart(chatId) {
  const msg = `
🇮🇳 *Welcome to FunBetMe Genie – India!*

I'm here to walk you through our Indian offers and send you to the right place.

🔥 *India launch bonuses*:
• ₹1,000 Free Sign-Up Bonus (no deposit needed)  
• 400% First Deposit Bonus  
• *20× wagering* on both bonuses  

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
• *20× wagering* on both bonuses  

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
/odds   – Open FunBet.AI odds & stats

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

// ======================================================
//  RUSSIA BOT – /webhook/funbetrussia
// ======================================================

app.post("/webhook/funbetrussia", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

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

    res.sendStatus(200);
  } catch (err) {
    console.error("🇷🇺 Russia bot webhook error:", err?.message || err);
    res.sendStatus(200);
  }
});

async function genieRussiaStart(chatId) {
  const msg = `
🇷🇺 *Добро пожаловать в FunBetMe Russia!*

🎁 *₽1000 бонус за регистрацию* (без депозита)  
🔥 *400% бонус на первый депозит*  
🔄 *20× отыгрыш* на всех бонусах  

👉 Открой сайт FunBet.Me:
${FUNBET_SITE}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieRussiaBonus(chatId) {
  const msg = `
🎁 *Бонусы для игроков из России*

• ₽1000 бонус за регистрацию (без депозита)  
• 400% бонус на первый депозит  
• *20× отыгрыш* на всех бонусах  

Все подробности читайте на странице акций:
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
✅ *Как получить бонусы (Россия)*

1. Зарегистрируйтесь на FunBet.Me  
2. Следуйте инструкциям в разделе "Акции" для России  
3. Бонусы будут зачислены автоматически после выполнения условий  

Нужна помощь?  
Откройте сайт и воспользуйтесь онлайн-чатом.

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
💡 *Команды FunBetMe Russia*

/start  – Обзор российских бонусов  
/bonus  – Детали бонусов регистрации и первого депозита  
/claim  – Как получить бонус  
/help   – Это меню  
/odds   – Перейти на FunBet.AI (коэффициенты и статистика)

🌐 Сайт: ${FUNBET_SITE}
📊 Коэффициенты: ${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieRussiaOdds(chatId) {
  const msg = `
📊 *FunBet.AI для игроков из России*

Сравнивайте коэффициенты и анализируйте статистику здесь:
${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

// ======================================================
//  BRAZIL BOT – /webhook/funbetbrazil
// ======================================================

app.post("/webhook/funbetbrazil", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

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

    res.sendStatus(200);
  } catch (err) {
    console.error("🇧🇷 Brazil bot webhook error:", err?.message || err);
    res.sendStatus(200);
  }
});

async function genieBrazilStart(chatId) {
  const msg = `
🇧🇷 *Bem-vindo ao FunBetMe Brasil!*

🎁 *Bônus de Cadastro R$100* (sem depósito)  
🔥 *Bônus de 400% no primeiro depósito*  
🔄 *Rollover 20×* para todos os bônus  

👉 Acesse FunBet.Me:
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
🎁 *Bônus para jogadores do Brasil*

• R$100 bônus de cadastro (sem depósito)  
• 400% de bônus no primeiro depósito  
• Rollover *20×*  

Veja todos os detalhes na página de promoções:
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
✅ *Como receber seus bônus (Brasil)*

1. Crie sua conta em FunBet.Me  
2. Siga as instruções na seção de Promoções para o Brasil  
3. Seus bônus serão creditados automaticamente após cumprir os requisitos  

Ajuda? Use o chat ao vivo no site.

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
💡 *Comandos FunBetMe Brasil*

/start  – Visão geral dos bônus no Brasil  
/bonus  – Detalhes do bônus de cadastro e primeiro depósito  
/claim  – Como receber seus bônus  
/help   – Este menu  
/odds   – Abrir FunBet.AI (odds & estatísticas)

🌐 Site: ${FUNBET_SITE}
📊 Odds: ${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieBrazilOdds(chatId) {
  const msg = `
📊 *FunBet.AI para jogadores do Brasil*

Compare odds e analise estatísticas aqui:
${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

// ======================================================
//  TURKEY BOT – /webhook/funbetturkey
// ======================================================

app.post("/webhook/funbetturkey", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim().toLowerCase();

  try {
    console.log("🇹🇷 Turkey bot incoming:", JSON.stringify(msg));

    if (text === "/start" || text === "start") {
      await genieTurkeyStart(chatId);
    } else if (text === "/bonus" || text === "bonus") {
      await genieTurkeyBonus(chatId);
    } else if (text === "/claim" || text === "claim") {
      await genieTurkeyClaim(chatId);
    } else if (text === "/help" || text === "help") {
      await genieTurkeyHelp(chatId);
    } else if (text === "odds" || text === "/odds") {
      await genieTurkeyOdds(chatId);
    } else {
      await genieUnknown(chatId, API_TURKEY);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("🇹🇷 Turkey bot webhook error:", err?.message || err);
    res.sendStatus(200);
  }
});

async function genieTurkeyStart(chatId) {
  const msg = `
🇹🇷 *FunBetMe Türkiye'ye Hoş Geldin!*

🎁 *₺500 Süper Kayıt Bonusu* (yatırım gerekmez)  
🔥 *%400 İlk Yatırım Bonusu*  
🔄 Tüm bonuslarda *20× çevrim şartı*  

👉 FunBet.Me sitesini aç:
${FUNBET_SITE}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieTurkeyBonus(chatId) {
  const msg = `
🎁 *Türkiye Bonusları ve Kampanyalar*

• ₺500 Süper Kayıt Bonusu (yatırım gerekmez)  
• %400 İlk Yatırım Bonusu  
• Tüm bonuslarda *20× çevrim şartı*  

Detaylı koşullar ve yeni kampanyalar için:
${FUNBET_PROMOS}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieTurkeyClaim(chatId) {
  const msg = `
✅ *Türkiye Bonuslarını Nasıl Alırsın?*

1. FunBet.Me sitesine gir ve yeni hesap oluştur  
2. Türkiye promosyon sayfasındaki adımları takip et  
3. Şartları tamamladığında, ₺500 kayıt bonusun ve %400 ilk yatırım bonusun
   otomatik olarak hesabına tanımlanır  

Yardım lazım olursa, sitedeki canlı sohbeti kullanabilirsin.

🌐 ${FUNBET_SITE}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieTurkeyHelp(chatId) {
  const msg = `
💡 *FunBetMe Türkiye Komutları*

/start  – Türkiye bonuslarına genel bakış  
/bonus  – ₺500 kayıt ve %400 ilk yatırım bonusu detayları  
/claim  – Bonuslarının nasıl yükleneceği  
/help   – Bu menü  
/odds   – FunBet.AI sayfasını aç (oranlar & istatistikler)

🌐 Site: ${FUNBET_SITE}
📊 Oranlar: ${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

async function genieTurkeyOdds(chatId) {
  const msg = `
📊 *FunBet.AI – Türkiye oyuncuları için*

Futbol, basketbol, bahis oranları ve istatistikleri burada:
${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown",
  });
}

// =====================
//  Start server
// =====================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`FunBetMe multi-geo bot running on port ${PORT}`);
});
