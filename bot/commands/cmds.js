const bot = require("../../config/bot");
const { APP_NAME, CATEGORIAS_CMDS } = require("../../utils/constants");
const { AYUDA } = require("../builders/buildHelp");

const FILE_ID = "AgACAgEAAxkDAAIC7GnaobEBiXlDGjaimvDjDae3CfXNAALiDGsbiq_YRuXPk0OfHG89AQADAgADeQADOwQ";
const PAGE_SIZE = 4;
const HOME_TITLE = `<b>📋 MENÚ DE COMANDOS</b>

👉 Al presionar cualquiera de los botones disponibles en este menú, podrás ingresar a las distintas categorías de opciones.

🚀 Cada sección contiene comandos específicos diseñados para cubrir tus necesidades de búsqueda y consulta.`;

const sessions = new Map();
const categorias = CATEGORIAS_CMDS;

// ========================
// 📦 FORMAT
// ========================
const formatItem = ({ titulo, cmds, creditos, estado }) => {
  const status = estado ? "ACTIVO ✅" : "OFF ⚠️";
  const credits = creditos === 0 ? "GRATIS" : creditos;
  const formatos = cmds.map((cmd) => `- Formato: ${cmd}`).join("\n");
  return [`📍 ${titulo}`, formatos, `- Estado: ${status}`, `- Créditos: ${credits}`].join("\n");
};

function buildPage(cat, page = 0) {
  const { titulo, items } = categorias[cat];
  const totalPages = Math.ceil(items.length / PAGE_SIZE) || 1;
  const content = items
    .slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    .map(formatItem)
    .join("\n━━━━━━━━━━━━━━\n");
  return [`${APP_NAME} ➤ COMANDOS PARA ${titulo.replace(/\[.*?\]/g, "")}`, "", content, "", `📄 Página ${page + 1}/${totalPages}`].join("\n");
}

// ========================
// ⌨️ KEYBOARDS
// ========================
const MAIN_KEYBOARD = (userId) => {
  const keys = Object.keys(categorias);
  const rows = [];

  for (let i = 0; i < keys.length; i += 2) {
    const row = keys.slice(i, i + 2).map((key) => ({
      text: categorias[key].titulo,
      callback_data: `cat_${userId}_${key}`,
    }));
    rows.push(row);
  }

  return { reply_markup: { inline_keyboard: rows } };
};

function buildKeyboard(userId, cat, page) {
  const items = categorias[cat]?.items || [];
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  if (totalPages <= 1) {
    return {
      reply_markup: {
        inline_keyboard: [[{ text: "🏠 Menú", callback_data: `menu_${userId}` }]],
      },
    };
  }

  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "◀️ Anterior", callback_data: `prev_${userId}_${cat}_${page}` },
          { text: "🏠 Menú", callback_data: `menu_${userId}` },
          { text: "▶️ Siguiente", callback_data: `next_${userId}_${cat}_${page}` },
        ],
      ],
    },
  };
}

// ========================
// 🛠 HELPERS
// ========================
async function invalidarSesionAnterior(userId, chatId) {
  const prev = sessions.get(userId);
  if (!prev) return;

  try {
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: prev.messageId });
  } catch (_) {}

  sessions.delete(userId);
}

function editMedia(chatId, messageId, caption, keyboard) {
  return bot.editMessageMedia({ type: "photo", media: FILE_ID, caption, parse_mode: "HTML" }, { chat_id: chatId, message_id: messageId, ...keyboard });
}

// ========================
// 🚀 REGISTER
// ========================
const helpHandler = (cmd) => (msg) => {
  bot.sendMessage(msg.chat.id, AYUDA[cmd], {
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id,
  });
};

const register = () => {
  for (const cmd of Object.keys(AYUDA)) {
    bot.onText(new RegExp(`^\\/${cmd}$`), helpHandler(cmd));
  }

  bot.onText(/\/cmds/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    await invalidarSesionAnterior(userId, chatId);

    const sent = await bot.sendPhoto(chatId, FILE_ID, {
      caption: HOME_TITLE,
      parse_mode: "HTML",
      reply_to_message_id: msg.message_id,
      ...MAIN_KEYBOARD(userId),
    });

    sessions.set(userId, { messageId: sent.message_id, cat: null, page: 0 });
  });

  bot.on("callback_query", async (query) => {
    const { message: msg, data, id: queryId, from } = query;
    const {
      chat: { id: chatId },
      message_id: messageId,
    } = msg;
    const userId = from.id;

    let session = sessions.get(userId);
    const dataPertenece = data.includes(`_${userId}_`) || data === `menu_${userId}`;

    if (!dataPertenece) {
      return bot.answerCallbackQuery(queryId, {
        text: "⛔ Este menú no te pertenece",
        show_alert: true,
      });
    }

    // Sesión no existe (reinicio del server), reconstruir
    if (!session) {
      sessions.set(userId, { messageId, cat: null, page: 0 });
      session = sessions.get(userId);
      try {
        await bot.editMessageMedia(
          { type: "photo", media: FILE_ID, caption: HOME_TITLE, parse_mode: "HTML" },
          { chat_id: chatId, message_id: messageId, ...MAIN_KEYBOARD(userId) },
        );
      } catch (err) {
        const desc = err.response?.body?.description || "";
        if (!desc.includes("message is not modified")) {
          console.error(err.response?.body || err);
        }
      }
      return bot.answerCallbackQuery(queryId);
    }

    try {
      if (data.startsWith(`cat_${userId}_`)) {
        const cat = data.replace(`cat_${userId}_`, "");

        if (session.cat === cat && session.page === 0) {
          return bot.answerCallbackQuery(queryId);
        }

        await editMedia(chatId, messageId, buildPage(cat, 0), buildKeyboard(userId, cat, 0));
        session.cat = cat;
        session.page = 0;
      } else if (data.startsWith(`next_${userId}_`)) {
        const rest = data.replace(`next_${userId}_`, "");
        const lastUnderscore = rest.lastIndexOf("_");
        const cat = rest.substring(0, lastUnderscore);
        const page = parseInt(rest.substring(lastUnderscore + 1));
        const total = Math.ceil((categorias[cat]?.items || []).length / PAGE_SIZE);

        if (page >= total - 1) {
          return bot.answerCallbackQuery(queryId, { text: "⚠️ Ya estás en la última página", show_alert: true });
        }

        await editMedia(chatId, messageId, buildPage(cat, page + 1), buildKeyboard(userId, cat, page + 1));
        session.cat = cat;
        session.page = page + 1;
      } else if (data.startsWith(`prev_${userId}_`)) {
        const rest = data.replace(`prev_${userId}_`, "");
        const lastUnderscore = rest.lastIndexOf("_");
        const cat = rest.substring(0, lastUnderscore);
        const page = parseInt(rest.substring(lastUnderscore + 1));

        if (page <= 0) {
          return bot.answerCallbackQuery(queryId, { text: "⚠️ Ya estás en la primera página", show_alert: true });
        }

        await editMedia(chatId, messageId, buildPage(cat, page - 1), buildKeyboard(userId, cat, page - 1));
        session.cat = cat;
        session.page = page - 1;
      } else if (data === `menu_${userId}`) {
        if (!session.cat && session.page === 0) {
          return bot.answerCallbackQuery(queryId);
        }

        await bot.editMessageMedia(
          { type: "photo", media: FILE_ID, caption: HOME_TITLE, parse_mode: "HTML" },
          { chat_id: chatId, message_id: messageId, ...MAIN_KEYBOARD(userId) },
        );
        session.cat = null;
        session.page = 0;
      }
    } catch (err) {
      const desc = err.response?.body?.description || "";
      if (!desc.includes("message is not modified")) {
        console.error(err.response?.body || err);
      }
    }

    bot.answerCallbackQuery(queryId);
  });
};

module.exports = { register };
