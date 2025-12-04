import express from "express";
import { Telegraf } from "telegraf";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// --------------------------------------------
//  ENV TOKENS FOR ALL FUNBETME GEO BOTS
// --------------------------------------------
const TOKENS = {
    genie: process.env.BOT_TOKEN_GENIE,
    india: process.env.BOT_TOKEN_INDIA,
    russia: process.env.BOT_TOKEN_RUSSIA,
    brazil: process.env.BOT_TOKEN_BRAZIL,
    turkey: process.env.BOT_TOKEN_TURKEY,
};

// --------------------------------------------
//  COUNTRY-BASED START MESSAGES
// --------------------------------------------
const START_MESSAGES = {
    genie: `🌟 *Welcome to FunBetMe Genie!*  
Your personal assistant for promo codes, offers and help.`,

    india: `🇮🇳 *Welcome to FunBetMe India!*  
💰 *₹1000 FREE Bonus* (No deposit)  
🎁 *400% First Deposit Bonus*  
🔄 *20× wagering* on all bonuses  
👉 Visit: https://funbet.me/`,

    russia: `🇷🇺 *Добро пожаловать в FunBetMe Russia!*  
🎁 *₽1000 Бонус* без депозита  
💸 *400% на первый депозит*  
🔄 Вейджер 20×  
👉 https://funbet.me/`,

    brazil: `🇧🇷 *Bem-vindo ao FunBetMe Brasil!*  
🎁 *R$100 Bônus* sem depósito  
🔥 *400% no Primeiro Depósito*  
🔄 Requisito de aposta: 20×  
👉 https://funbet.me/`,

    turkey: `🇹🇷 *FunBetMe Türkiye'ye Hoşgeldin!*  
🎁 *₺500 Kayıt Bonusu* (Yatırım gerekmez)  
🔥 *%400 İlk Yatırım Bonusu*  
🔄 Çevirim şartı: 20×  
👉 https://funbet.me/`,
};

// --------------------------------------------
//  STORAGE FOR BOT INSTANCES
// --------------------------------------------
const bots = {};

// --------------------------------------------
//  CREATE TELEGRAM BOTS FOR EACH GEO
// --------------------------------------------
Object.entries(TOKENS).forEach(([geo, token]) => {
    if (!token) {
        console.log(`⚠️ Missing token for ${geo.toUpperCase()} bot`);
        return;
    }

    console.log(`✅ Initialising FunBetMe ${geo.toUpperCase()} bot...`);

    const bot = new Telegraf(token);

    // START command
    bot.start((ctx) => {
        console.log(`🚀 /start used in ${geo} by`, ctx.from.username || ctx.from.id);
        ctx.reply(START_MESSAGES[geo], { parse_mode: "Markdown" });
    });

    // fallback text
    bot.on("message", (ctx) => {
        ctx.reply("✨ Type /start to see the latest FunBetMe offers!");
    });

    bot.catch((err) => {
        console.error(`❌ Error inside ${geo} bot:`, err);
    });

    bots[geo] = bot;
});

// --------------------------------------------
//  WEBHOOK ENDPOINT (DIGITALOCEAN)
// --------------------------------------------
app.post("/webhook/:geo", async (req, res) => {
    const geo = req.params.geo;

    if (!bots[geo]) {
        console.log(`❌ Invalid webhook call for GEO: ${geo}`);
        return res.sendStatus(404);
    }

    try {
        await bots[geo].handleUpdate(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(`❌ Webhook error for GEO ${geo}:`, err);
        res.sendStatus(500);
    }
});

// --------------------------------------------
//  ROOT ENDPOINT
// --------------------------------------------
app.get("/", (req, res) => {
    res.send("🔥 FunBetMe Multi-GEO Telegram Bot System Active");
});

// --------------------------------------------
//  START EXPRESS SERVER
// --------------------------------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
    console.log("Bots Ready:", Object.keys(bots));
});
