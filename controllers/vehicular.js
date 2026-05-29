const { fetchData } = require("../config/azura");

const consultarPlaca = async (req, res) => {
  const { placa } = req.params;

  try {
    const data = await fetchData("placa", { placa });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const consultarPlacaSunarp = async (req, res) => {
  const { placa } = req.params;

  try {
    const data = await fetchData("placa_sunarp_pdf", { placa });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const consultarPlacaRequisitoria = async (req, res) => {
  const { placa } = req.params;

  try {
    const data = await fetchData("requisitorias", { documento: placa });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  consultarPlaca,
  consultarPlacaSunarp,
  consultarPlacaRequisitoria,
};
