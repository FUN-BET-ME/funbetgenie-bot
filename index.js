import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// =====================
//  CONFIG – TOKENS
// =====================

// Global / main Genie bot
const TOKEN_GENIE = process.env.BOT_TOKEN_GENIE;
// India-only Genie bot
const TOKEN_INDIA = process.env.BOT_TOKEN_INDIA;
// Russia bot
const TOKEN_RUSSIA = process.env.BOT_TOKEN_RUSSIA;
// Brazil bot
const TOKEN_BRAZIL = process.env.BOT_TOKEN_BRAZIL;
// Turkey bot
const TOKEN_TURKEY = process.env.BOT_TOKEN_TURKEY;

if (!TOKEN_GENIE) console.error("❌ BOT_TOKEN_GENIE is not set.");
if (!TOKEN_INDIA) console.error("❌ BOT_TOKEN_INDIA is not set.");
if (!TOKEN_RUSSIA) console.error("❌ BOT_TOKEN_RUSSIA is not set.");
if (!TOKEN_BRAZIL) console.error("❌ BOT_TOKEN_BRAZIL is not set.");
if (!TOKEN_TURKEY) console.error("❌ BOT_TOKEN_TURKEY is not set.");

const API_GENIE  = TOKEN_GENIE  ? `https://api.telegram.org/bot${TOKEN_GENIE}`  : null;
const API_INDIA  = TOKEN_INDIA  ? `https://api.telegram.org/bot${TOKEN_INDIA}`  : null;
const API_RUSSIA = TOKEN_RUSSIA ? `https://api.telegram.org/bot${TOKEN_RUSSIA}` : null;
const API_BRAZIL = TOKEN_BRAZIL ? `https://api.telegram.org/bot${TOKEN_BRAZIL}` : null;
const API_TURKEY = TOKEN_TURKEY ? `https://api.telegram.org/bot${TOKEN_TURKEY}` : null;

// Useful links
const FUNBET_SITE   = "https://funbet.me/";
const FUNBET_PROMOS = "https://funbet.me/en/promotions";
const FUNBET_ODDS   = "https://funbet.ai/";

// Small helper for sending messages
async function sendTelegramMessage(apiBase, payload) {
  if (!apiBase) {
    console.error("❌ Missing Telegram API base");
    return;
  }
  try {
    await axios.post(`${apiBase}/sendMessage`, payload);
  } catch (err) {
    console.error("Telegram sendMessage error:", err?.response?.data || err.message || err);
  }
}

// =====================
//  Health check
// =====================

app.get("/", (req, res) => {
  res.send("FunBet Genie multi-bot (Global + India + Russia + Brazil + Turkey) is running!");
});

// ==================================================
//  GLOBAL GENIE BOT – /webhook/funbetgenie
// ==================================================

app.post("/webhook/funbetgenie", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat) return res.sendStatus(200);

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

    res.sendStatus(200);
  } catch (err) {
    console.error("🌍 Global bot webhook error:", err?.message || err);
    res.sendStatus(200);
  }
});

// ===== GLOBAL bot message builders =====

async function genieGlobalStart(chatId) {
  const msg = `
Welcome to *FunBet Genie* ✨

I'm here to guide you to FunBet.Me and help you discover the best bonuses and odds.

🔥 Current welcome offers (global):
• Free sign-up bonus (check country-specific value on the site)  
• First deposit bonus with low wagering (20×)  
• Access to casino, sports, and more

👉 Tap here to open FunBet.Me:
${FUNBET_SITE}

You analyse. You decide. *Your skill. Your win!*
`;
  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieGlobalBonus(chatId) {
  const msg = `
🎁 *FunBet.Me Promotions*

See all current sign-up, first deposit, and daily offers here:
${FUNBET_PROMOS}

FunBet.Me focuses on:
• Competitive odds  
• 20× wagering on main welcome bonuses  
• Clear terms and transparent rewards  

Check your country-specific welcome offer on the promotions page.
`;
  return sendTelegramMessage(API_GENIE, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
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
    parse_mode: "Markdown"
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
    parse_mode: "Markdown"
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
    parse_mode: "Markdown"
  });
}

// ==================================================
//  INDIA GENIE BOT – /webhook/funbetindia
// ==================================================

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

// ===== INDIA bot messages =====

async function genieIndiaStart(chatId) {
  const msg = `
🇮🇳 *Welcome to FunBetMe Genie – India!*

I'm here to walk you through our Indian offers and send you to the right place.

🔥 *India launch bonuses*:
• ₹1,000 Free Sign-Up Bonus (no deposit)  
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
    parse_mode: "Markdown"
  });
}

async function genieIndiaBonus(chatId) {
  const msg = `
🎁 *India Bonuses & Promotions*

For Indian players we currently offer:
• ₹1,000 Free Sign-Up Bonus (no deposit)  
• 400% First Deposit Bonus (Casino & Sports)  
• 20× wagering on both bonuses  

Full details and any new offers are always here:
${FUNBET_PROMOS}

Make sure to read the terms on the site so you know exactly how to qualify.
`;
  return sendTelegramMessage(API_INDIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
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
    parse_mode: "Markdown"
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
    parse_mode: "Markdown"
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
    parse_mode: "Markdown"
  });
}

// ==================================================
//  RUSSIA BOT – /webhook/funbetrussia
// ==================================================

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
🇷🇺 *Добро пожаловать в FunBetMe Genie – Россия!*

Я помогу тебе получить российские бонусы и лучшие коэффициенты.

🔥 *Бонусы для России*:
• Супер бонус за регистрацию: ₽1 000 без депозита  
• 400% бонус на первый депозит (казино + спорт)  
• Всего *20× отыгрыш* по обоим бонусам  

👉 Открой FunBet.Me и зарегистрируйся:
${FUNBET_SITE}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieRussiaBonus(chatId) {
  const msg = `
🎁 *Бонусы и акции для игроков из России*

• ₽1 000 бонус за регистрацию без депозита  
  – шанс выиграть до 20×, максимум ₽20 000  
• 400% бонус на первый депозит (казино и спорт)  
  – максимум для бонуса: депозит до ₽100 000  
• Отыгрыш: *20×* от суммы бонуса  

Полные условия и новые акции смотри здесь:
${FUNBET_PROMOS}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieRussiaClaim(chatId) {
  const msg = `
✅ *Как получить бонусы в России*

1. Перейди на сайт FunBet.Me и создай новый аккаунт  
2. Введи нужный промо-код и следуй условиям на странице "Акции"  
3. После выполнения условий твой бонус (₽1 000 за регистрацию и 400% на первый депозит)
   будет автоматически зачислен на счёт  

Нужна помощь? Используй онлайн-чат на сайте.

🌐 ${FUNBET_SITE}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieRussiaHelp(chatId) {
  const msg = `
💡 *Команды FunBetMe Genie – Россия*

/start  – Обзор российских бонусов  
/bonus  – Подробности бонусов ₽1 000 и 400%  
/claim  – Как активировать бонусы  
/help   – Это меню  
odds    – Открыть FunBet.AI с коэффициентами

🌐 Сайт: ${FUNBET_SITE}
📊 Статистика и коэффициенты: ${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieRussiaOdds(chatId) {
  const msg = `
📊 *FunBet.AI для игроков из России*

Сравнивай коэффициенты и форму команд здесь:
${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_RUSSIA, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

// ==================================================
//  BRAZIL BOT – /webhook/funbetbrazil
// ==================================================

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
🇧🇷 *Bem-vindo ao FunBetMe Genie – Brasil!*

Eu te levo direto para os bônus do Brasil e para as melhores odds.

🔥 *Bônus para o Brasil*:
• Bônus de Cadastro R$100 (sem depósito)  
• Bônus de Primeiro Depósito 400% (Cassino + Esportes)  
• Apenas *20× de wagering* em ambos os bônus  

👉 Abre FunBet.Me e cria a tua conta:
${FUNBET_SITE}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieBrazilBonus(chatId) {
  const msg = `
🎁 *Bônus e Promoções – Brasil*

• Bônus de cadastro: R$100 grátis  
  – ganho máximo R$2.000 (20×)  
• Bônus de primeiro depósito: 400% para Cassino e Esportes  
  – depósito máximo elegível para o bônus: R$10.000  
• Requisito de wagering: *20×* do valor do bônus  

Confere todos os detalhes e novas promoções aqui:
${FUNBET_PROMOS}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieBrazilClaim(chatId) {
  const msg = `
✅ *Como resgatar os bônus no Brasil*

1. Acesse FunBet.Me e crie a sua conta  
2. Siga as instruções na página de Promoções (códigos FBM20 / FD400, quando aplicável)  
3. Depois de cumprir os requisitos, o bônus de R$100 e o 400% do primeiro depósito
   serão creditados automaticamente na sua conta  

Precisa de ajuda? Use o chat ao vivo no site.

🌐 ${FUNBET_SITE}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieBrazilHelp(chatId) {
  const msg = `
💡 *Comandos do FunBetMe Genie – Brasil*

/start  – Visão geral dos bônus do Brasil  
/bonus  – Detalhes do bônus de cadastro e 400% primeiro depósito  
/claim  – Como ativar os bônus  
/help   – Este menu  
odds    – Abrir FunBet.AI com odds e estatísticas

🌐 Site: ${FUNBET_SITE}
📊 Odds & estatísticas: ${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieBrazilOdds(chatId) {
  const msg = `
📊 *FunBet.AI para o Brasil*

Compara odds e analisa estatísticas aqui:
${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_BRAZIL, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

// ==================================================
//  TURKEY BOT – /webhook/funbetturkey
// ==================================================

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
🇹🇷 *FunBetMe Genie – Türkiye'ye hoş geldin!*

Türkiye oyuncuları için özel bonusları ve en iyi oranları sana gösteriyorum.

🔥 *Türkiye bonusları*:
• Süper Kayıt Bonusu: 500 ₺ (yatırım gerekmez)  
• İlk Yatırım Bonusu: %400 (casino + spor)  
• Her iki bonus için de sadece *20× çevirim şartı*  

👉 FunBet.Me sitesini aç ve hemen kayıt ol:
${FUNBET_SITE}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieTurkeyBonus(chatId) {
  const msg = `
🎁 *Türkiye Bonusları ve Kampanyaları*

• Süper Kayıt Bonusu: 500 ₺ bedava  
  – kazanma şansı 20×, maksimum kazanç 10.000 ₺  
• İlk Yatırım Bonusu: %400 casino ve spor için  
  – bonus için maksimum yatırım: 50.000 ₺  
• Çevirim şartı: bonus tutarının *20×*  

Tüm detaylar ve yeni kampanyalar için:
${FUNBET_PROMOS}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieTurkeyClaim(chatId) {
  const msg = `
✅ *Türkiye bonuslarını nasıl alırsın?*

1. FunBet.Me sitesine gir ve yeni bir hesap aç  
2. Türkiye promosyon sayfasındaki adımları takip et (gerekli kodları kullan)  
3. Şartları tamamladıktan sonra 500 ₺ kayıt bonusun ve %400 ilk yatırım bonusun
   otomatik olarak hesabına yansır  

Yardım istersen, sitedeki canlı sohbeti kullanabilirsin.

🌐 ${FUNBET_SITE}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieTurkeyHelp(chatId) {
  const msg = `
💡 *FunBetMe Genie – Türkiye Komutları*

/start  – Türkiye tekliflerinin özeti  
/bonus  – 500 ₺ kayıt bonusu ve %400 ilk yatırım detayları  
/claim  – Bonusların nasıl yükleneceği  
/help   – Bu menü  
odds    – FunBet.AI oranlar ve istatistikler

🌐 Site: ${FUNBET_SITE}
📊 Oranlar & istatistikler: ${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

async function genieTurkeyOdds(chatId) {
  const msg = `
📊 *FunBet.AI – Türkiye oyuncuları için*

Futbol, basketbol ve daha fazlası için oranları burada karşılaştır:
${FUNBET_ODDS}
`;
  return sendTelegramMessage(API_TURKEY, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

// ==================================================
//  SHARED FALLBACK
// ==================================================

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
    text: msg
  });
}

// =====================
//  Start server
// =====================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`FunBet Genie multi-bot running on port ${PORT}`);
});
