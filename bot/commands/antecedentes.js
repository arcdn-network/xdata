const bot = require("../../config/bot");

const { DOCUMENTOS } = require("../../utils/constants");
const { bufferToStream } = require("../../utils/functions");
const { renderDocumento } = require("../render/reniecRender");
const { getUsuario, buildMensajeCertificado } = require("../builders/buildReniec");

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

const validarDNI = (chatId, documento, replyTo) => {
  if (!/^\d{8}$/.test(documento)) {
    bot.sendMessage(chatId, "❌ El DNI debe tener exactamente 8 dígitos numéricos.", {
      reply_to_message_id: replyTo,
    });
    return false;
  }
  return true;
};

const consultarDNI = async (documento) => {
  try {
    const data = await fetchData("reniec", { documento });
    const listaAni = data?.listaAni;
    const d = Array.isArray(listaAni) ? listaAni[0] : listaAni;

    if (!d) return null;
    return { data, d };
  } catch (err) {
    console.error("Error consultarDNI:", err.message);
    return null;
  }
};

const enviarDocumento = async ({ chatId, replyTo, loadingId, buffer, filename, caption }) => {
  await bot.sendDocument(chatId, bufferToStream(buffer, filename), { caption, parse_mode: "HTML", reply_to_message_id: replyTo }, { filename, contentType: "application/pdf" });
  await safeDelete(chatId, loadingId);
};

// ── Handlers ─────────────────────────────────────────────────────────────────

const handleCertificado = (tipo) => async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim();
  const replyTo = msg.message_id;

  if (!validarDNI(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo, "⏳ Generando documento...");

  try {
    const result = await consultarDNI(documento);

    if (!result) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const pdf = await renderDocumento(result.data, tipo);
    const { d } = result;

    const config = DOCUMENTOS[tipo];

    if (!config) {
      await safeDelete(chatId, loading.message_id);
      return bot.sendMessage(chatId, `⚠️ No existe plantilla para: ${tipo}`, {
        reply_to_message_id: replyTo,
      });
    }

    const filename = config.file(d.nuDni);

    await enviarDocumento({
      chatId,
      replyTo,
      loadingId: loading.message_id,
      buffer: pdf,
      filename,
      caption: buildMensajeCertificado(d, getUsuario(msg), tipo),
    });
  } catch (err) {
    console.error(`Error generando ${tipo}:`, err);
    await safeDelete(chatId, loading.message_id);
    bot.sendMessage(chatId, "❌ Error al generar documento.", {
      reply_to_message_id: replyTo,
    });
  }
};

// ── Register ──────────────────────────────────────────────────────────────────

const register = async () => {
  bot.onText(/\/antj (.+)/, handleCertificado("antj"));
  bot.onText(/\/antp (.+)/, handleCertificado("antp"));
  bot.onText(/\/antpe (.+)/, handleCertificado("antpe"));
};

module.exports = { register };
