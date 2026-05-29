const validateDNI = (req, res, next) => {
  const { documento } = req.params;

  if (!/^\d{8}$/.test(documento)) {
    return res.status(400).json({
      success: false,
      message: "El DNI debe tener exactamente 8 dígitos numéricos.",
    });
  }

  next();
};

const validateRUC = (req, res, next) => {
  const { documento } = req.params;

  if (!/^\d{11}$/.test(documento)) {
    return res.status(400).json({
      success: false,
      message: "El DNI debe tener exactamente 11 dígitos numéricos.",
    });
  }

  next();
};

const validatePLACA = (req, res, next) => {
  let { placa } = req.params;

  placa = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const patterns = [
    /^[A-Z]{3}\d{3}$/, // ABC123
    /^[A-Z]{2}\d{4}$/, // AB1234
    /^\d{3,4}[A-Z]{2}$/, // 123AB
    /^[A-Z]\d[A-Z]\d{3}$/, // M4V635
  ];

  const isValid = patterns.some((regex) => regex.test(placa));

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Formato de placa inválido.",
    });
  }
  req.params.placa = placa;
  next();
};

const validateCELULAR = (req, res, next) => {
  const { celular } = req.params;

  if (!/^9\d{8}$/.test(celular)) {
    return res.status(400).json({
      success: false,
      message: "El número de celular debe tener 9 dígitos y comenzar con 9.",
    });
  }

  next();
};

const validateDocumentoOrCelular = (req, res, next) => {
  const { valor } = req.params;

  const isDNI = /^\d{8}$/.test(valor);
  const isCelular = /^9\d{8}$/.test(valor);

  if (!isDNI && !isCelular) {
    return res.status(400).json({
      success: false,
      message: "Debe ser un DNI (8 dígitos) o un celular válido (9 dígitos que empiece con 9).",
    });
  }

  req.tipo = isDNI ? "dni" : "celular";

  next();
};

module.exports = {
  validateDNI,
  validateRUC,
  validatePLACA,
  validateCELULAR,
  validateDocumentoOrCelular,
};
