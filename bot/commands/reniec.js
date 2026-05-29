const bot = require("../../config/bot");

const { DOCUMENTOS } = require("../../utils/constants");
const { renderDniVirtual, renderDocumento } = require("../render/reniecRender");
const { getUsuario, buildNombres, buildMensajeReniec, buildCaptionDniVirtual, buildMensajeC4 } = require("../builders/buildReniec");
const { toPhoto, toStream, toBuffer, bufferToStream } = require("../../utils/functions");
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

const validarNombre = (chatId, input, replyTo) => {
  const [nombres, apaterno, amaterno] = input.split("|").map((v) => v?.trim().toUpperCase());

  const cantidad = [nombres, apaterno, amaterno].filter(Boolean).length;

  if (cantidad < 2) {
    bot.sendMessage(chatId, "❌ Debes enviar al menos 2 parámetros.\nEjemplo:\n/nm JUAN|PEREZ|LOPEZ", {
      reply_to_message_id: replyTo,
    });
    return null;
  }

  return { nombres, apaterno, amaterno };
};

const consultarNombre = async ({ nombres, apaterno, amaterno }) => {
  try {
    const data = await fetchData("nombres", { nombres, apaterno, amaterno });

    const listaRaw = data?.listaAni;
    if (!listaRaw) return [];

    return Array.isArray(listaRaw) ? listaRaw : [listaRaw];
  } catch (err) {
    console.error("Error consultarNombre:", err.message);
    return [];
  }
};

const enviarDocumento = async ({ chatId, replyTo, loadingId, buffer, filename, caption }) => {
  await bot.sendDocument(chatId, bufferToStream(buffer, filename), { caption, parse_mode: "HTML", reply_to_message_id: replyTo }, { filename, contentType: "application/pdf" });
  await safeDelete(chatId, loadingId);
};

// ── Handlers ─────────────────────────────────────────────────────────────────

const handleNombres = async (msg, match) => {
  const chatId = msg.chat.id;
  const replyTo = msg.message_id;

  const datos = validarNombre(chatId, match[1], replyTo);
  if (!datos) return;

  const loading = await sendLoading(chatId, replyTo);

  try {
    const lista = await consultarNombre(datos);

    if (!lista.length) {
      return handleNoResult(chatId, loading.message_id, replyTo);
    }

    const usuario = getUsuario(msg);

    if (lista.length > 20) {
      const contenido = buildNombres(lista, usuario);
      const filename = `Nombres_${Date.now()}.txt`;

      await bot.sendDocument(
        chatId,
        bufferToStream(Buffer.from(contenido, "utf-8"), filename),
        {
          caption: `<b>⚠️ Búsqueda de Nombres</b>\n\n📄 Resultado muy extenso, enviado como archivo.`,
          parse_mode: "HTML",
          reply_to_message_id: replyTo,
        },
        { filename, contentType: "text/plain" },
      );
    } else {
      await bot.sendMessage(chatId, buildNombres(lista, usuario, { html: true }), {
        parse_mode: "HTML",
        reply_to_message_id: replyTo,
      });
    }

    await safeDelete(chatId, loading.message_id);
  } catch (err) {
    console.error(err);
    await safeDelete(chatId, loading.message_id);
    bot.sendMessage(chatId, "❌ Error en la búsqueda.", {
      reply_to_message_id: replyTo,
    });
  }
};

const handleDni = (modo) => async (msg, match) => {
  const chatId = msg.chat.id;
  const documento = match[1].trim();
  const replyTo = msg.message_id;

  if (!validarDNI(chatId, documento, replyTo)) return;

  const loading = await sendLoading(chatId, replyTo);

  try {
    const result = await consultarDNI(documento);

    if (!result) {
      return handleNoResult(chatId, loading.message_id, replyTo, "⚠️ No se encontraron datos para ese DNI.");
    }

    const { raw, d } = result;
    const mensaje = buildMensajeReniec(d, raw, getUsuario(msg));
    const opts = { parse_mode: "HTML", reply_to_message_id: replyTo };

    if (modo === "full") {
      const imagenes = [
        raw.foto && toPhoto(raw.foto, "foto"),
        raw.firma && toPhoto(raw.firma, "firma"),
        raw.hderecha && toPhoto(raw.hderecha, "huella_derecha"),
        raw.hizquierda && toPhoto(raw.hizquierda, "huella_izquierda"),
      ].filter(Boolean);

      if (imagenes.length) {
        imagenes[0].caption = mensaje;
        imagenes[0].parse_mode = "HTML";
        await bot.sendMediaGroup(chatId, imagenes, { reply_to_message_id: replyTo });
      } else {
        await bot.sendMessage(chatId, mensaje, opts);
      }
    } else {
      if (raw.foto) {
        await bot.sendPhoto(chatId, toBuffer(raw.foto), { ...opts, caption: mensaje });
      } else {
        await bot.sendMessage(chatId, mensaje, opts);
      }
    }

    await safeDelete(chatId, loading.message_id);
  } catch (err) {
    console.error(err);
    await safeDelete(chatId, loading.message_id);
    bot.sendMessage(chatId, "❌ Error al consultar. Intenta nuevamente.", { reply_to_message_id: replyTo });
  }
};

const handleDniVir = async (msg, match) => {
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

    const { anverso, reverso } = await renderDniVirtual(result.data);
    const { d } = result;
    const usuario = getUsuario(msg);

    await bot.sendDocument(chatId, toStream(anverso, `FRONTAL(${d.nuDni}).png`), {
      caption: buildCaptionDniVirtual(d, usuario, "FRONTAL"),
      parse_mode: "HTML",
      reply_to_message_id: replyTo,
    });

    await bot.sendDocument(chatId, toStream(reverso, `POSTERIOR(${d.nuDni}).png`), {
      caption: buildCaptionDniVirtual(d, usuario, "POSTERIOR"),
      parse_mode: "HTML",
    });

    await safeDelete(chatId, loading.message_id);
  } catch (err) {
    console.error("Error renderizando DNI virtual:", err);
    await safeDelete(chatId, loading.message_id);
    bot.sendMessage(chatId, "❌ Error al generar el DNI virtual.", {
      reply_to_message_id: replyTo,
    });
  }
};

const handleC4 = (tipo) => async (msg, match) => {
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
      caption: buildMensajeC4(d, getUsuario(msg), tipo),
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
  bot.onText(/\/nm (.+)/, handleNombres);
  bot.onText(/\/dni (.+)/, handleDni("basic"));
  bot.onText(/\/dnit (.+)/, handleDni("full"));
  bot.onText(/\/dnivir (.+)/, handleDniVir);
  bot.onText(/\/c4 (.+)/, handleC4("c4"));
  bot.onText(/\/c4a (.+)/, handleC4("c4a"));
  bot.onText(/\/c4f (.+)/, handleC4("c4f"));
};

module.exports = { register };
