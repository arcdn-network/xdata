const bot = require("../../config/bot");

const { buildPaginasTelefonos } = require("../builders/buildOsiptel");
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
  return bot.sendMessage(chatId, text, { reply_to_message_id: replyTo });
};

const getUsuario = (msg) => (msg.from.username ? `@${msg.from.username}` : String(msg.from.id));

// ── Validadores ───────────────────────────────────────────────────────────────

const TIPOS = {
  celular: {
    digitos: 9,
    errorFormato: "❌ El número de celular debe tener exactamente 9 dígitos.\nEjemplo: <code>/telp 987654321</code>",
    errorNoNumerico: "❌ Ingresa solo números para el celular.\nEjemplo: <code>/telp 987654321</code>",
  },
  dni: {
    digitos: 8,
    errorFormato: "❌ El DNI debe tener exactamente 8 dígitos.\nEjemplo: <code>/teldni 12345678</code>",
    errorNoNumerico: "❌ Ingresa solo números para el DNI.\nEjemplo: <code>/teldni 12345678</code>",
  },
};

const validarEntrada = (valor, tipo) => {
  const config = TIPOS[tipo];

  if (!/^\d+$/.test(valor)) {
    return { valido: false, error: config.errorNoNumerico };
  }

  if (valor.length !== config.digitos) {
    return { valido: false, error: config.errorFormato };
  }

  return { valido: true };
};

// ── Handler principal ─────────────────────────────────────────────────────────

const handleTelefonos = (tipo) => async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim();
  const replyTo = msg.message_id;
  const usuario = getUsuario(msg);

  // Validar antes de consultar
  const validacion = validarEntrada(documento, tipo);
  if (!validacion.valido) {
    return bot.sendMessage(chatId, validacion.error, {
      parse_mode: "HTML",
      reply_to_message_id: replyTo,
    });
  }

  const loading = await sendLoading(chatId, replyTo);

  try {
    const data = await fetchData("osiptel", { documento });

    if (!data || data.status !== "success" || !data.listaAni || data.listaAni.total_lineas === 0) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const paginas = buildPaginasTelefonos(data, usuario);

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

    bot.sendMessage(chatId, "❌ Error al consultar.", {
      reply_to_message_id: replyTo,
    });
  }
};

// ── Register ──────────────────────────────────────────────────────────────────

const register = async () => {
  bot.onText(/\/telp (\S+)/, handleTelefonos("celular"));
  bot.onText(/\/teldni (\S+)/, handleTelefonos("dni"));
};

module.exports = { register };
