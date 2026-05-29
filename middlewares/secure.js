const OWNER_ID = 7219427873;

const secureBot = (bot) => {
  const originalOnText = bot.onText.bind(bot);
  const originalOn = bot.on.bind(bot);

  // interceptar comandos
  bot.onText = (regex, callback) => {
    originalOnText(regex, (msg, match) => {
      if (msg.from.id !== OWNER_ID) return;
      callback(msg, match);
    });
  };

  // interceptar eventos generales
  bot.on = (event, callback) => {
    originalOn(event, (msg) => {
      if (msg?.from && msg.from.id !== OWNER_ID) return;
      callback(msg);
    });
  };

  return bot;
};

module.exports = { secureBot };
