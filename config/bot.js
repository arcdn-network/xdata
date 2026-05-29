const TelegramBot = require("node-telegram-bot-api");
const { secureBot } = require("../middlewares/secure");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
secureBot(bot);

module.exports = bot;
