const { fetchData } = require("../config/azura");

const consultarFamilia = async (req, res) => {
  const { documento } = req.params;
  try {
    const [me, data] = await Promise.all([fetchData("reniec", { documento }), fetchData("familia", { documento })]);

    const meData = Array.isArray(me.listaAni) ? me.listaAni[0] : me.listaAni;

    const fotoRaw = meData?.foto || me.foto || null;
    if (fotoRaw) {
      meData.foto = fotoRaw.startsWith("data:") ? fotoRaw : `data:image/jpeg;base64,${fotoRaw}`;
    }

    data.me = meData;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const consultarHogar = async (req, res) => {
  const { documento } = req.params;
  try {
    const data = await fetchData("hogar", { documento });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  consultarFamilia,
  consultarHogar,
};
