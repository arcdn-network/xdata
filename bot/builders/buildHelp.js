const { CATEGORIAS_CMDS } = require("../../utils/constants");

const buildAyuda = (categorias) => {
  const ayuda = {};

  for (const categoria of Object.values(categorias)) {
    for (const item of categoria.items) {
      for (const cmd of item.cmds) {
        const [cmdParte, ...argPartes] = cmd.trim().split(" ");
        const key = cmdParte.replace("/", "");
        const arg = argPartes.join(" ");

        let argDesc;

        if (/^\d{8}$/.test(arg)) {
          argDesc = "seguido de un número de DNI";
        } else if (/^\d{11}$/.test(arg)) {
          argDesc = "seguido de un número de RUC";
        } else if (/^\d{9}$/.test(arg)) {
          argDesc = "seguido de un número de celular";
        } else if (/^[A-Z]{3}\d{3}$/.test(arg)) {
          argDesc = "seguido de una placa vehicular";
        } else if (/^\d+\|/.test(arg)) {
          argDesc = `con los campos de ejemplo`;
        } else if (/^[a-z]+ [a-z]+/i.test(arg)) {
          argDesc = "seguido de un nombre completo";
        } else {
          argDesc = `seguido de <code>${arg}</code>`;
        }

        if (ayuda[key]) {
          ayuda[key] += `\n<pre>${cmd}</pre>`;
        } else if (!arg) {
          ayuda[key] = `${item.titulo}\n\n` + `⚠️ Debes enviar una imagen junto con el comando.\n\n` + `✅ 𝐄𝐣𝐞𝐦𝐩𝐥𝐨 𝐝𝐞 𝐮𝐬𝐨:\n` + `<pre>${cmd}</pre>`;
        } else {
          ayuda[key] = `${item.titulo}\n\n` + `⚠️ Escribe el comando ${argDesc}.\n\n` + `✅ 𝐄𝐣𝐞𝐦𝐩𝐥𝐨 𝐝𝐞 𝐮𝐬𝐨:\n` + `<pre>${cmd}</pre>`;
        }
      }
    }
  }

  return ayuda;
};

const AYUDA = buildAyuda(CATEGORIAS_CMDS);

module.exports = { AYUDA };
