const { APP_NAME } = require("../../utils/constants");

const ITEMS_POR_PAGINA = 3;

// ── Bloque ────────────────────────────────────────────────────────────────
const buildBloqueTelefono = (l) =>
  [
    `TITULAR : <code>${l.nombres_completos}</code>`,
    `TELEFONO : <code>${l.numero_telefonico}</code>`,
    `DOCUMENTO : <code>${l.documento}</code>`,
    `LINEA : <code>${l.tipo_linea || "None"}</code>`,
    `OPERADORA : <code>${l.operador}</code>`,
    `PLAN : <code>${l.plan || "None"}</code>`,
    `FECHA ACTIVACION : <code>${l.fecha_activacion}</code>`,
    `FECHA ACTUALIZACION : <code>${l.fecha_empresa}</code>`,
    `EMPRESA : <code>${l.operador}</code>`,
    `CORREO : <code>${l.correo || "No disponible"}</code>`,
  ].join("\n");

// ── Paginador ─────────────────────────────────────────────────────────────
const buildPaginasTelefonos = (raw, usuario) => {
  const lista = raw?.listaAni?.lineas || [];

  const chunks = [];
  for (let i = 0; i < lista.length; i += ITEMS_POR_PAGINA) {
    chunks.push(lista.slice(i, i + ITEMS_POR_PAGINA));
  }

  return chunks.map((chunk, idx) => {
    const bloques = chunk.map(buildBloqueTelefono).join("\n-----------------------------\n");

    return `
📞 <b>TELEFONIA TIEMPO REAL</b>
${APP_NAME} | TITULARES OSIPTEL

📄 PAGINA ${idx + 1}/${chunks.length}
🔎 CONSULTA : <code>${raw.listaAni.valor_consultado}</code>

${bloques}

-----------------------------
Realizada por ➟ ${usuario}
`.trim();
  });
};
module.exports = {
  buildPaginasTelefonos,
};
