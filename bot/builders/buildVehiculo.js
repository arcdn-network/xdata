// builders/buildPlaca.js

const { APP_NAME } = require("../../utils/constants");

// ── Internos ────────────────────────────────────────────────────────────────

const fmt = (val) => (val !== undefined && val !== null && val !== "" ? val : "—");

const buildBloqueInfoPlaca = (info) =>
  [
    `𝗣𝗟𝗔𝗖𝗔 ➟ <code>${fmt(info.placa)}</code>`,
    `𝗡𝗨𝗠 𝗣𝗔𝗥𝗧𝗜𝗗𝗔 ➟ <code>${fmt(info.num_partida)}</code>`,
    `𝗢𝗙𝗜𝗖𝗜𝗡𝗔 ➟ <code>${fmt(info.oficina)}</code>`,
    `𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢𝗡 ➟ <code>${fmt(info.area_registral)}</code>`,
    `𝗘𝗦𝗧𝗔𝗗𝗢 ➟ <code>${fmt(info.estado)}</code>`,
  ].join("\n");

// ── Públicos ────────────────────────────────────────────────────────────────

const buildCaptionPlaca = (raw, usuario) => {
  const entry = Array.isArray(raw.listaAni) ? raw.listaAni[0] : (raw.listaAni ?? {});
  const info = entry.informacion_placa ?? {};

  return `\
${APP_NAME} ➣ <b>PLACA SUNARP ❰ PDF ❱</b>

${buildBloqueInfoPlaca(info)}

Realizada por ➟ ${usuario}`.trim();
};

const buildCaptionTive = (raw, usuario) => {
  const entry = Array.isArray(raw.listaAni) ? raw.listaAni[0] : (raw.listaAni ?? {});
  const v = entry.vehiculo ?? {};
  const dim = v.dimensiones ?? {};
  const propietarios = entry.propietarios ?? [];

  const buildPropietarios = () =>
    propietarios
      .map((p, i) =>
        [
          `👤 <b>PROPIETARIO ${propietarios.length > 1 ? i + 1 : ""}</b>`.trim(),
          `𝗡𝗢𝗠𝗕𝗥𝗘 ➟ <code>${fmt(p.nombre)}</code>`,
          `𝗗𝗢𝗖𝗨𝗠𝗘𝗡𝗧𝗢 ➟ <code>${fmt(p.tipo_documento)} ${fmt(p.documento)}</code>`,
          `𝗙𝗘𝗖𝗛𝗔 𝗣𝗥𝗢𝗣 ➟ <code>${fmt(p.fecha_propiedad)}</code>`,
          `𝗗𝗜𝗥𝗘𝗖𝗖𝗜𝗢𝗡 ➟ <code>${fmt(p.direccion)}</code>`,
        ].join("\n"),
      )
      .join("\n\n");

  return `\
${APP_NAME} ➣ <b>CONSULTA VEHICULAR</b>

🚗 <b>VEHÍCULO</b>
𝗣𝗟𝗔𝗖𝗔 ➟ <code>${fmt(v.placa)}</code>
𝗠𝗔𝗥𝗖𝗔 ➟ <code>${fmt(v.marca)}</code>
𝗠𝗢𝗗𝗘𝗟𝗢 ➟ <code>${fmt(v.modelo)}</code>
𝗔Ñ𝗢 ➟ <code>${fmt(v.anio_fabricacion)}</code>
𝗖𝗢𝗟𝗢𝗥 ➟ <code>${fmt(v.color)}</code>
𝗖𝗢𝗠𝗕𝗨𝗦𝗧𝗜𝗕𝗟𝗘 ➟ <code>${fmt(v.combustible)}</code>
𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗔 ➟ <code>${fmt(v.categoria)}</code>
𝗧𝗜𝗣𝗢 ➟ <code>${fmt(v.tipo_vehiculo)}</code>
𝗨𝗦𝗢 ➟ <code>${fmt(v.uso)}</code>
𝗔𝗦𝗜𝗘𝗡𝗧𝗢𝗦 ➟ <code>${fmt(v.asientos)}</code>
𝗣𝗔𝗦𝗔𝗝𝗘𝗥𝗢𝗦 ➟ <code>${fmt(v.pasajeros)}</code>
𝗠𝗢𝗧𝗢𝗥 ➟ <code>${fmt(v.motor)}</code>
𝗦𝗘𝗥𝗜𝗘/𝗩𝗜𝗡 ➟ <code>${fmt(v.vin)}</code>
𝗣𝗘𝗦𝗢 𝗕𝗥𝗨𝗧𝗢 ➟ <code>${fmt(v.peso_bruto)}</code>
𝗣𝗘𝗦𝗢 𝗦𝗘𝗖𝗢 ➟ <code>${fmt(v.peso_seco)}</code>
𝗗𝗜𝗠𝗘𝗡𝗦𝗜𝗢𝗡𝗘𝗦 ➟ <code>${fmt(dim.largo)} x ${fmt(dim.ancho)} x ${fmt(dim.alto)}</code>
𝗜𝗡𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢𝗡 ➟ <code>${fmt(v.inscripcion)}</code>
𝗢𝗙𝗜𝗖𝗜𝗡𝗔 ➟ <code>${fmt(v.oficina)}</code>
𝗣𝗔𝗥𝗧𝗜𝗗𝗔 ➟ <code>${fmt(v.partida)}</code>

${buildPropietarios()}

Realizada por ➟ ${usuario}`.trim();
};

module.exports = {
  buildCaptionPlaca,
  buildCaptionTive,
};
