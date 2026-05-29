const { fetchData } = require("../config/azura");

const consultarOsiptel = async (req, res) => {
  const { valor } = req.params;
  try {
    const documento = valor;
    const data = await fetchData("osiptel", { documento });

    if (!data || data.success === false) {
      return res.status(503).json({ success: false, message: data?.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const consultarTelefonos = async (req, res) => {
  const { valor } = req.params;
  try {
    const documento = valor;
    const data = await fetchData("telefono_base", { documento });

    if (!data || data.success === false) {
      return res.status(503).json({ success: false, message: data?.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  consultarOsiptel,
  consultarTelefonos,
};
