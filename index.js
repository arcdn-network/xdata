process.env.NTBA_FIX_350 = 1;
require("dotenv").config({ quiet: true });
const express = require("express");
const app = express();

// BOT
const { registerAll } = require("./bot");
const { IS_PRODUCCION } = require("./utils/constants");
registerAll();

// APIS
app.use(express.json());
app.use("/api", require("./routes/routes"));

// WELCOME
app.get("/", (req, res) => {
  res.json({
    message: "¡Bienvenido al servidor XpressData",
    version: "1.0.0",
  });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const isProd = IS_PRODUCCION;

  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const cyan = "\x1b[36m";
  const reset = "\x1b[0m";

  const entorno = isProd ? "PRODDUCCIÓN" : "DESARROLLO";

  console.log(`${green}[API]${reset} ${cyan}http://localhost:${PORT}${reset}`);
  console.log(`${isProd ? green : yellow}[BOT]${reset} ${entorno}`);
});
