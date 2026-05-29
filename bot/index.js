const cmds = require("./commands/cmds");
const reniec = require("./commands/reniec");
const familia = require("./commands/familia");
const osiptel = require("./commands/osiptel");
const antecedentes = require("./commands/antecedentes");
const vehicular = require("./commands/vehicular");

const bot = require("../config/bot");

const registerAll = async () => {
  cmds.register();
  reniec.register();
  familia.register();
  antecedentes.register();
  osiptel.register();
  vehicular.register();

  await bot.setMyCommands([
    { command: "cmds", description: "Comandos disponibles" },
    { command: "nm", description: "Buscar nombres" },
    { command: "dni", description: "Consultar datos RENIEC" },
    { command: "dnit", description: "Consultar RENIEC con fotos y huellas" },
    { command: "dnie", description: "Generar DNI Electrónico" },
    { command: "dnivir", description: "Generar DNI Virtual" },
    { command: "c4", description: "Generar ficha C4 Blanco" },
    { command: "c4a", description: "Generar ficha C4 Azul" },
    { command: "c4f", description: "Generar ficha C4 Certificado de Inscripción" },
    { command: "ag", description: "Árbol genealógico (texto)" },
    { command: "agv", description: "Árbol genealógico (visual)" },
    { command: "hogar", description: "Integrantes del hogar" },
    { command: "antj", description: "Antecedentes Judiciales" },
    { command: "antp", description: "Antecedentes Policiales" },
    { command: "antpe", description: "Antecedentes Penales" },
    { command: "tels", description: "Consultar líneas base" },
    { command: "telp", description: "Consultar líneas con celular" },
    { command: "teldni", description: "Consultar líneas con DNI" },
  ]);
};

module.exports = { registerAll };
