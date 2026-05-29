const { fetchData } = require("../config/azura");

const consultarFree = async (req, res) => {
  const { documento } = req.params;
  try {
    const data = await fetchData("reniec_free", { documento });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const consultarFull = async (req, res) => {
  const { documento } = req.params;
  try {
    const data = await fetchData("reniec", { documento });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const consultarNombres = async (req, res) => {
  const { nombres, apaterno, amaterno } = req.body;

  const params = [nombres, apaterno, amaterno].filter(Boolean);
  if (params.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar al menos 2 parámetros: nombres, apaterno o amaterno.",
    });
  }

  try {
    const data = await fetchData("nombres", { nombres, apaterno, amaterno });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  consultarFree,
  consultarFull,
  consultarNombres,
};
