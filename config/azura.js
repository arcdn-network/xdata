const { IS_PRODUCCION } = require("../utils/constants");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const azura = axios.create({
  baseURL: process.env.URL_AZURA,
  headers: { "X-Auth-Token": process.env.TOKEN_AZURA, "Content-Type": "application/json" },
});

const loadMock = async (fileName) => {
  try {
    const filePath = path.join(__dirname, `../assets/test/${fileName}`);
    const content = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
};

const fetchData = async (endpoint, body) => {
  if (!IS_PRODUCCION) {
    return loadMock(`${endpoint}.json`);
  }

  try {
    const response = await azura.post(`/${endpoint}`, body);
    return response.data || null;
  } catch (error) {
    const status = error.response?.status;
    return {
      success: false,
      message: status === 503 ? "Servicio externo no disponible" : "Error en la consulta",
    };
  }
};

module.exports = {
  fetchData,
};
