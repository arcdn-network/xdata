const { APP_NAME } = require("../../utils/constants");

const ITEMS_POR_PAGINA = 10;

// ── Internos ────────────────────────────────────────────────────────────────

const buildBloque = (p) =>
  [
    `TIPO: <code>${p.TIPO}</code>`,
    `DNI: <code>${p.DNI}</code>`,
    `APELLIDOS: <code>${p.APELLIDOS}</code>`,
    `NOMBRES: <code>${p.NOMBRES}</code>`,
    `GÉNERO: <code>${p.GENERO}</code>`,
    `EDAD: <code>${p.EDAD} AÑOS</code>`,
    `VERIFICACIÓN: <code>${p.VERIFICACION}</code>`,
  ].join("\n");

// ── Públicos ────────────────────────────────────────────────────────────────

const buildPaginasArbol = (lista = []) => {
  const chunks = [];

  for (let i = 0; i < lista.length; i += ITEMS_POR_PAGINA) {
    chunks.push(lista.slice(i, i + ITEMS_POR_PAGINA));
  }

  return chunks.map((chunk, idx) => {
    const bloques = chunk.map(buildBloque).join("\n\n");

    return `
${APP_NAME} ➣<b>ÁRBOL GENEALÓGICO ❰ PREMIUM ❱</b>

[📄] PÁGINA ${idx + 1}/${chunks.length}

${bloques}
`.trim();
  });
};

const buildCaptionArbol = (raw, usuario) => {
  const me = raw.me || {};
  const lista = Array.isArray(raw.listaAni) ? raw.listaAni : [];

  const nombre = [me.preNombres, me.apePaterno, me.apeMaterno].filter(Boolean).join(" ");

  return `${APP_NAME} ➣ <b>ÁRBOL GENEALÓGICO</b>

𝗗𝗢𝗖𝗨𝗠𝗘𝗡𝗧𝗢 ➟ <code>${me.nuDni || "—"}</code>
𝗡𝗢𝗠𝗕𝗥𝗘𝗦 ➟ <code>${nombre || "—"}</code>
𝗧𝗢𝗧𝗔𝗟 𝗙𝗔𝗠𝗜𝗟𝗜𝗔𝗥𝗘𝗦 ➟ <code>${lista.length}</code>

Realizada por ➟ ${usuario}`.trim();
};

const buildCaptionHogar = (raw, usuario) => {
  const d = Array.isArray(raw.listaAni) ? raw.listaAni[0] : raw.listaAni;
  const h = d?.hogar || {};

  const cse = h.clasificacion_socioeconomica || {};
  const emp = h.empadronamiento || {};

  const titular = [h.nombres_titular, h.apellido_paterno_titular, h.apellido_materno_titular].filter(Boolean).join(" ");

  return `${APP_NAME} ➣ <b>INTEGRANTES DE HOGAR</b>

𝗗𝗢𝗖𝗨𝗠𝗘𝗡𝗧𝗢 ➟ <code>${h.documento_titular || "—"}</code>
𝗡𝗢𝗠𝗕𝗥𝗘𝗦 ➟ <code>${titular || "—"}</code>
𝗘𝗦𝗧𝗔𝗗𝗢 𝗛𝗢𝗚𝗔𝗥 ➟ <code>${h.hogar_estado || "—"}</code>
𝗖𝗟𝗔𝗦𝗜𝗙𝗜𝗖𝗔𝗖𝗜𝗢𝗡 ➟ <code>${cse.clasificacion || "—"}</code>
𝗗𝗘𝗣𝗔𝗥𝗧𝗔𝗠𝗘𝗡𝗧𝗢 ➟ <code>${emp.departamento || "—"}</code>
𝗣𝗥𝗢𝗩𝗜𝗡𝗖𝗜𝗔 ➟ <code>${emp.provincia || "—"}</code>
𝗗𝗜𝗦𝗧𝗥𝗜𝗧𝗢 ➟ <code>${emp.distrito || "—"}</code>
𝗗𝗜𝗥𝗘𝗖𝗖𝗜𝗢𝗡 ➟ <code>${emp.direccion || "—"}</code>

Realizada por ➟ ${usuario}`.trim();
};

module.exports = {
  buildPaginasArbol,
  buildCaptionArbol,
  buildCaptionHogar,
};
