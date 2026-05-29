const { APP_NAME, DOCUMENTOS } = require("../../utils/constants");

const getUsuario = (msg) => (msg.from.username ? `@${msg.from.username}` : String(msg.from.id));

const buildNombres = (lista, usuario, { html = false } = {}) => {
  const filas = lista
    .map((p) =>
      html
        ? `𝗗𝗡𝗜:  <code>${p.dni}</code>\n` +
          `𝗡𝗢𝗠𝗕𝗥𝗘𝗦: ${p.nombres}\n` +
          `𝗔𝗣𝗘𝗟𝗟𝗜𝗗𝗢 𝗣𝗔𝗧𝗘𝗥𝗡𝗢: ${p.apellido_paterno}\n` +
          `𝗔𝗣𝗘𝗟𝗟𝗜𝗗𝗢 𝗠𝗔𝗧𝗘𝗥𝗡𝗢: ${p.apellido_materno}\n` +
          `𝗘𝗗𝗔𝗗: ${p.edad} AÑOS`
        : `DNI: ${p.dni}\nNOMBRES: ${p.nombres}\nAPELLIDO PATERNO: ${p.apellido_paterno}\nAPELLIDO MATERNO: ${p.apellido_materno}\nEDAD: ${p.edad}`,
    )
    .join("\n\n");

  return html
    ? `${APP_NAME} 🕵🏻‍♂️<b> BUSQUEDA POR NOMBRES</b>\n\n` + `<b>SE ENCONTRARON ${lista.length} RESULTADOS.</b>\n\n` + `${filas}\n\n` + `🔍 <b>Realizada por:</b> ${usuario}`
    : `${APP_NAME} - BUSQUEDA POR NOMBRES\n\nSE ENCONTRARON ${lista.length} RESULTADOS\n\n${filas}\n\nRealizada por: ${usuario}`;
};

const buildMensajeReniec = (d, raw, usuario) =>
  `${APP_NAME} ➣<b>RENIEC ❰ PREMIUM ❱</b>

𝗗𝗡𝗜 ➟ <code>${d.nuDni}</code> - <code>${d.digitoVerificacion}</code>
𝗡𝗢𝗠𝗕𝗥𝗘 ➟ <code>${d.preNombres}</code>
𝗔𝗣𝗘𝗟𝗟𝗜𝗗𝗢 𝗣𝗔𝗧𝗘𝗥𝗡𝗢 ➟ <code>${d.apePaterno}</code>
𝗔𝗣𝗘𝗟𝗟𝗜𝗗𝗢 𝗠𝗔𝗧𝗘𝗥𝗡𝗢 ➟ <code>${d.apeMaterno}</code>
𝗦𝗘𝗫𝗢 ➟ <code>${d.sexo}</code>

[📅] 𝗡𝗔𝗖𝗜𝗠𝗜𝗘𝗡𝗧𝗢

𝗙𝗘𝗖𝗛𝗔 𝗗𝗘 𝗡𝗔𝗖𝗜𝗠𝗜𝗘𝗡𝗧𝗢 ➟ <code>${d.feNacimiento}</code>
𝗗𝗘𝗣𝗔𝗥𝗧𝗔𝗠𝗘𝗡𝗧𝗢 ➟ <code>${d.departamento}</code>
𝗣𝗥𝗢𝗩𝗜𝗡𝗖𝗜𝗔 ➟ <code>${d.provincia}</code>
𝗗𝗜𝗦𝗧𝗥𝗜𝗧𝗢 ➟ <code>${d.distrito}</code>

[🪪] 𝗜𝗡𝗙𝗢

𝗚𝗥𝗔𝗗𝗢 𝗗𝗘 𝗜𝗡𝗦𝗧𝗥𝗨𝗖𝗖𝗜𝗢𝗡 ➟ <code>${d.gradoInstruccion}</code>
𝗘𝗦𝗧𝗔𝗗𝗢 𝗖𝗜𝗩𝗜𝗟 ➟ <code>${d.estadoCivil}</code>
𝗘𝗗𝗔𝗗 ➟ <code>${d.nuEdad} AÑOS</code>
𝗘𝗦𝗧𝗔𝗧𝗨𝗥𝗔 ➟ <code>${d.estatura}</code>
𝗙𝗘𝗖𝗛𝗔 𝗗𝗘 𝗜𝗡𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢𝗡 ➟ <code>${d.feInscripcion}</code>
𝗙𝗘𝗖𝗛𝗔 𝗗𝗘 𝗘𝗠𝗜𝗦𝗜𝗢𝗡 ➟ <code>${d.feEmision}</code>
𝗙𝗘𝗖𝗛𝗔 𝗗𝗘 𝗖𝗔𝗗𝗨𝗖𝗜𝗗𝗔𝗗 ➟ <code>${d.feCaducidad}</code>
𝗥𝗘𝗦𝗧𝗥𝗜𝗖𝗖𝗜𝗢𝗡 ➟ <code>${d.deRestriccion}</code>
𝗗𝗢𝗡𝗔𝗖𝗜𝗢𝗡 𝗗𝗘 𝗢𝗥𝗚𝗔𝗡𝗢𝗦 ➟ <code>${d.donaOrganos}</code>

[👨‍👩‍👦] 𝗣𝗔𝗗𝗥𝗘𝗦

𝗣𝗔𝗗𝗥𝗘 ➟ <code>${d.nomPadre}</code>
𝗗𝗡𝗜 𝗗𝗘𝗟 𝗣𝗔𝗗𝗥𝗘 ➟ <code>${d.nuDocPadre?.trim() || "—"}</code>
𝗠𝗔𝗗𝗥𝗘 ➟ <code>${d.nomMadre}</code>
𝗗𝗡𝗜 𝗗𝗘 𝗟𝗔 𝗠𝗔𝗗𝗥𝗘 ➟ <code>${d.nuDocMadre?.trim() || "—"}</code>

[📍] 𝗨𝗕𝗜𝗖𝗔𝗖𝗜𝗢𝗡

𝗗𝗘𝗣𝗔𝗥𝗧𝗔𝗠𝗘𝗡𝗧𝗢 ➟ <code>${d.depaDireccion}</code>
𝗣𝗥𝗢𝗩𝗜𝗡𝗖𝗜𝗔 ➟ <code>${d.provDireccion}</code>
𝗗𝗜𝗦𝗧𝗥𝗜𝗧𝗢 ➟ <code>${d.distDireccion}</code>
𝗗𝗜𝗥𝗘𝗖𝗖𝗜𝗢𝗡 ➟ <code>${d.desDireccion}</code>

[🌐] 𝗨𝗕𝗜𝗚𝗘𝗢

𝗨𝗕𝗜𝗚𝗘𝗢 𝗜𝗡𝗘𝗜 ➟ <code>${raw.ubigeoDomicilio?.UbigeoInei}</code>
𝗨𝗕𝗜𝗚𝗘𝗢 𝗥𝗘𝗡𝗜𝗘𝗖 ➟ <code>${raw.ubigeoDomicilio?.UbigeoReniec}</code>
𝗨𝗕𝗜𝗚𝗘𝗢 𝗦𝗨𝗡𝗔𝗧 ➟ <code>${raw.ubigeoDomicilio?.UbigeoSunat}</code>

🔍 <b>Realizada por:</b> ${usuario}`.trim();

const buildCaptionDniVirtual = (d, usuario, lado) =>
  `🪪 ➟ [${lado}]\n` +
  `${APP_NAME} ➣ <b>DNI VIRTUAL ❰ PREMIUM ❱</b>\n\n` +
  `𝗗𝗡𝗜 ➟ <code>${d.nuDni}</code>\n` +
  `𝗡𝗢𝗠𝗕𝗥𝗘 ➟ <code>${d.preNombres}</code>\n` +
  `𝗔𝗣.𝗣𝗔𝗧𝗘𝗥𝗡𝗢 ➟ <code>${d.apePaterno}</code>\n` +
  `𝗔𝗣.𝗠𝗔𝗧𝗘𝗥𝗡𝗢 ➟ <code>${d.apeMaterno}</code>\n` +
  `𝗙.𝗡𝗔𝗖𝗜𝗠𝗜𝗘𝗡𝗧𝗢 ➟ <code>${d.feNacimiento}</code>\n\n` +
  `Realizada por ➟ ${usuario}`;

const buildMensajeC4 = (d, usuario, tipo) => {
  const { title } = DOCUMENTOS[tipo] ?? { title: "DOCUMENTO" };

  return (
    `${APP_NAME} ➣ <b>${title} ❰ PREMIUM ❱</b>\n\n` +
    `𝗗𝗡𝗜 ➟ <code>${d.nuDni}</code> - <code>${d.digitoVerificacion}</code>\n` +
    `𝗡𝗢𝗠𝗕𝗥𝗘𝗦 ➟ <code>${d.preNombres}</code>\n` +
    `𝗔𝗣𝗘𝗟𝗟𝗜𝗗𝗢 𝗣𝗔𝗧𝗘𝗥𝗡𝗢 ➟ <code>${d.apePaterno}</code>\n` +
    `𝗔𝗣𝗘𝗟𝗟𝗜𝗗𝗢 𝗠𝗔𝗧𝗘𝗥𝗡𝗢 ➟ <code>${d.apeMaterno}</code>\n\n` +
    `Realizada por ➟ ${usuario}`
  );
};

const buildMensajeCertificado = (d, usuario, tipo) => {
  const { title } = DOCUMENTOS[tipo] ?? { title: "DOCUMENTO" };

  const now = new Date();
  const fecha = now.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const nombreCompleto = `${d.preNombres} ${d.apePaterno} ${d.apeMaterno}`;

  return (
    `📄 <b>${title} ❰ PREMIUM ❱</b>\n\n` +
    `👤 <b>Nombre:</b> <code>${nombreCompleto}</code>\n` +
    `📅 <b>Fecha de Informe:</b> <code>${fecha}</code>\n` +
    `⏰ <b>Hora de Generación:</b> <code>${hora}</code>\n` +
    `🆔 <b>DNI:</b> <code>${d.nuDni}</code>\n\n` +
    `Realizada por ➟ ${usuario}`
  );
};

module.exports = {
  getUsuario,
  buildNombres,
  buildMensajeReniec,
  buildCaptionDniVirtual,
  buildMensajeCertificado,
  buildMensajeC4,
};
