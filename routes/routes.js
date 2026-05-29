const express = require("express");
const router = express.Router();

const reniec = require("../controllers/reniec");
const osiptel = require("../controllers/osiptel");
const familia = require("../controllers/familia");
const vehicular = require("../controllers/vehicular");

const { validateDNI, validateDocumentoOrCelular, validatePLACA } = require("../middlewares/validates");

router.post("/reniec/nombres", reniec.consultarNombres);
router.get("/reniec/free/:documento", [validateDNI], reniec.consultarFree);
router.get("/reniec/full/:documento", [validateDNI], reniec.consultarFull);

router.get("/familia/arbol/:documento", [validateDNI], familia.consultarFamilia);
router.get("/familia/hogar/:documento", [validateDNI], familia.consultarHogar);

router.get("/osiptel/telp/:valor", [validateDocumentoOrCelular], osiptel.consultarOsiptel);
router.get("/osiptel/tels/:valor", [validateDocumentoOrCelular], osiptel.consultarTelefonos);

router.get("/vehicular/placa/:placa", [validatePLACA], vehicular.consultarPlaca);
router.get("/vehicular/sunarp/:placa", [validatePLACA], vehicular.consultarPlacaSunarp);
router.get("/vehicular/requisitoria/:placa", [validatePLACA], vehicular.consultarPlacaRequisitoria);

module.exports = router;
