const bot = require("../../config/bot");

const { renderArbol, renderHogar } = require("../render/familiaRender");
const { buildPaginasArbol, buildCaptionArbol, buildCaptionHogar } = require("../builders/buildFamilia");
const { toStream } = require("../../utils/functions");
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

const validarDNI = (chatId, documento, replyTo) => {
  if (!/^\d{8}$/.test(documento)) {
    bot.sendMessage(chatId, "❌ El DNI debe tener exactamente 8 dígitos numéricos.", {
      reply_to_message_id: replyTo,
    });
    return false;
  }
  return true;
};

const getUsuario = (msg) => (msg.from.username ? `@${msg.from.username}` : String(msg.from.id));

// ── 🔥 FETCH UNIFICADO ───────────────────────────────────────────────────────

const fetchBase = async (endpoint, documento) => {
  try {
    const data = await fetchData(endpoint, { documento });
    return data?.status === "success" || endpoint === "reniec" ? data : null;
  } catch (err) {
    console.error(`Error ${endpoint}:`, err.message);
    return null;
  }
};

// 🔥 Trae data + reniec opcional
const fetchWithReniec = async (endpoint, documento, withReniec = false) => {
  try {
    if (withReniec) {
      const [data, reniec] = await Promise.all([fetchBase(endpoint, documento), fetchBase("reniec", documento)]);

      if (!data || !reniec) return null;

      const lista = reniec?.listaAni;
      const me = Array.isArray(lista) ? lista[0] : lista;

      if (reniec?.foto) {
        me.foto = reniec.foto.startsWith("data:") ? reniec.foto : `data:image/jpeg;base64,${reniec.foto}`;
      }

      return {
        ...data,
        me,
      };
    }

    return await fetchBase(endpoint, documento);
  } catch (err) {
    console.error("Error fetchWithReniec:", err.message);
    return null;
  }
};

// ── Envío render ─────────────────────────────────────────────────────────────

const enviarRender = async ({ chatId, replyTo, loadingId, data, filename, caption, renderFn }) => {
  const buffer = await renderFn(data);

  await bot.sendDocument(
    chatId,
    toStream(buffer, filename),
    {
      caption,
      parse_mode: "HTML",
      reply_to_message_id: replyTo,
    },
    {
      filename,
      contentType: "image/png",
    },
  );

  await safeDelete(chatId, loadingId);
};

// ── Handlers ─────────────────────────────────────────────────────────────────

// /ag (solo lista)
const handleArbol = async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim();
  const replyTo = msg.message_id;

  if (!validarDNI(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo);

  try {
    const data = await fetchWithReniec("familia", documento);

    if (!data) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const paginas = buildPaginasArbol(data.listaAni);

    for (const pagina of paginas) {
      await bot.sendMessage(chatId, pagina, {
        parse_mode: "HTML",
        reply_to_message_id: replyTo,
      });
    }

    await safeDelete(chatId, loading.message_id);
  } catch (err) {
    console.error(err);
    await safeDelete(chatId, loading.message_id);

    bot.sendMessage(chatId, "❌ Error al consultar. Intenta nuevamente.", {
      reply_to_message_id: replyTo,
    });
  }
};

// /agv (árbol virtual con RENIEC)
const handleArbolVirtual = async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim();
  const replyTo = msg.message_id;

  if (!validarDNI(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo, "⏳ Generando documento...");

  try {
    const data = await fetchWithReniec("familia", documento, true);

    if (!data) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const me = data.me || {};

    await enviarRender({
      chatId,
      replyTo,
      loadingId: loading.message_id,
      data,
      filename: `Arbol_${me?.nuDni || documento}.png`,
      caption: buildCaptionArbol(data, getUsuario(msg)),
      renderFn: renderArbol,
    });
  } catch (err) {
    console.error(err);
    await safeDelete(chatId, loading.message_id);

    bot.sendMessage(chatId, "❌ Error al generar la imagen.", {
      reply_to_message_id: replyTo,
    });
  }
};

// /hogar (también con RENIEC)
const handleHogar = async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim();
  const replyTo = msg.message_id;

  if (!validarDNI(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo, "⏳ Generando documento...");

  try {
    const data = await fetchWithReniec("hogar", documento, true);

    if (!data) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const d = Array.isArray(data.listaAni) ? data.listaAni[0] : data.listaAni;

    await enviarRender({
      chatId,
      replyTo,
      loadingId: loading.message_id,
      data,
      filename: `Hogar_${d?.hogar?.documento_titular || documento}.png`,
      caption: buildCaptionHogar(data, getUsuario(msg)),
      renderFn: renderHogar,
    });
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
  bot.onText(/\/ag (.+)/, handleArbol);
  bot.onText(/\/agv (.+)/, handleArbolVirtual);
  bot.onText(/\/hogar (.+)/, handleHogar);
};

module.exports = { register };
