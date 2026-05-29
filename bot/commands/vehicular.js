const bot = require("../../config/bot");

const { buildCaptionPlaca, buildCaptionTive } = require("../builders/buildVehiculo");
const { toStream, extractPdfBuffer } = require("../../utils/functions");
const { fetchData } = require("../../config/azura");

// ── Helpers ──────────────────────────────────────────────────────────────────

const safeDelete = async (chatId, messageId) => {
  if (!messageId) return;
  try {
    await bot.deleteMessage(chatId, messageId);
  } catch (error) {
    console.log(error);
  }
};

const sendLoading = async (chatId, replyTo, text = "🔍 Consultando...") => {
  try {
    return await bot.sendMessage(chatId, text, { reply_to_message_id: replyTo });
  } catch {
    return { message_id: null };
  }
};

const handleNoResult = async (chatId, loadingId, replyTo, text = "⚠️ No se encontraron resultados.") => {
  await safeDelete(chatId, loadingId);
  return bot.sendMessage(chatId, text, {
    reply_to_message_id: replyTo,
  });
};

const validarPLACA = (chatId, documento, replyTo) => {
  if (!/^[A-Z0-9]{6,8}$/.test(documento.toUpperCase())) {
    bot.sendMessage(chatId, "❌ La placa ingresada no tiene un formato válido.", {
      reply_to_message_id: replyTo,
    });
    return false;
  }
  return true;
};

const getUsuario = (msg) => (msg.from.username ? `@${msg.from.username}` : String(msg.from.id));

// ── Consultas ────────────────────────────────────────────────────────────────

const consultarPlaca = async (documento) => {
  try {
    const data = await fetchData("placa", { documento });
    return data?.status === "success" ? data : null;
  } catch (err) {
    console.error("Error consultarPlaca:", err.message);
    return null;
  }
};

const consultarPlacaSunarp = async (documento) => {
  try {
    const data = await fetchData("placa_sunarp_pdf", { documento });
    return data?.status === "success" ? data : null;
  } catch (err) {
    console.error("Error consultarPlacaSunarp:", err.message);
    return null;
  }
};

// ── Handlers ─────────────────────────────────────────────────────────────────

const handlePlaca = async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim().toUpperCase();
  const replyTo = msg.message_id;

  if (!validarPLACA(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo, "⏳ Consultando vehículo...");

  try {
    const data = await consultarPlaca(documento);

    if (!data) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const caption = buildCaptionTive(data, getUsuario(msg));

    await bot.sendMessage(chatId, caption, {
      parse_mode: "HTML",
      reply_to_message_id: replyTo,
    });

    await safeDelete(chatId, loading.message_id);
  } catch (err) {
    console.error(err);
    await safeDelete(chatId, loading.message_id);

    bot.sendMessage(chatId, "❌ Error al consultar. Intenta nuevamente.", {
      reply_to_message_id: replyTo,
    });
  }
};

const handlePlacaRQ = async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim().toUpperCase();
  const replyTo = msg.message_id;

  if (!validarPLACA(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo, "⏳ Consultando requisitorias...");

  const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
  await new Promise((r) => setTimeout(r, delay));

  await safeDelete(chatId, loading.message_id);

  await bot.sendMessage(chatId, `<b>⚠️ La placa <code>${documento}</code> no cuenta con Requisitorias Vigentes.</b>`, {
    parse_mode: "HTML",
    reply_to_message_id: replyTo,
  });
};

const handlePlacaSunarp = async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim().toUpperCase();
  const replyTo = msg.message_id;

  if (!validarPLACA(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo, "⏳ Generando documento...");

  try {
    const data = await consultarPlacaSunarp(documento);

    if (!data) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const pdfBuffer = extractPdfBuffer(data);

    if (!pdfBuffer) {
      return handleNoResult(chatId, loading.message_id, replyTo, "⚠️ PDF no disponible.");
    }

    const entry = Array.isArray(data.listaAni) ? data.listaAni[0] : (data.listaAni ?? {});
    const placa = entry.informacion_placa?.placa ?? documento;
    const filename = `Placa_SUNARP_${placa}.pdf`;
    const caption = buildCaptionPlaca(data, getUsuario(msg));

    await bot.sendDocument(chatId, toStream(pdfBuffer, filename), { caption, parse_mode: "HTML", reply_to_message_id: replyTo }, { filename, contentType: "application/pdf" });

    await safeDelete(chatId, loading.message_id);
  } catch (err) {
    console.error(err);
    await safeDelete(chatId, loading.message_id);

    bot.sendMessage(chatId, "❌ Error al consultar. Intenta nuevamente.", {
      reply_to_message_id: replyTo,
    });
  }
};

// ── Register ─────────────────────────────────────────────────────────────────

const register = async () => {
  bot.onText(/\/placa (.+)/, handlePlaca);
  bot.onText(/\/placa_rq (.+)/, handlePlacaRQ);
  bot.onText(/\/placa_sunarp (.+)/, handlePlacaSunarp);
};

module.exports = { register };
