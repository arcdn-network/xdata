const APP_NAME = "❰ #XpressData ❱";
const ASSETS = "../../assets/templates";
const IS_PRODUCCION = true;

const DOCUMENTOS = {
  c4: {
    title: "RENIEC C4 BLANCO",
    html: "ficha_c4.html",
    file: (dni) => `Ficha_C4_${dni}.pdf`,
    cmd: "/c4 12345678",
  },
  c4a: {
    title: "RENIEC C4 AZUL",
    html: "ficha_c4a.html",
    file: (dni) => `Ficha_C4A_${dni}.pdf`,
    cmd: "/c4a 12345678",
  },
  c4f: {
    title: "FICHA DE INSCRIPCIÓN",
    html: "ficha_c4f.html",
    file: (dni) => `Ficha_C4F_${dni}.pdf`,
    cmd: "/c4f 12345678",
  },
  antj: {
    title: "CERTIFICADO ANTECEDENTES JUDICIALES",
    html: "ant_judiciales.html",
    file: (dni) => `Antecedentes_Judiciales_${dni}.pdf`,
    cmd: "/antj 12345678",
  },
  antp: {
    title: "CERTIFICADO ANTECEDENTES POLICIALES",
    html: "ant_policiales.html",
    file: (dni) => `Antecedentes_Policiales_${dni}.pdf`,
    cmd: "/antp 12345678",
  },
  antpe: {
    title: "CERTIFICADO ANTECEDENTES PENALES",
    html: "ant_penales.html",
    file: (dni) => `Antecedentes_Penales_${dni}.pdf`,
    cmd: "/antpe 12345678",
  },
};

const CATEGORIAS_CMDS = {
  reniec: {
    titulo: "RENIEC [🪪]",
    items: [
      { titulo: "𝐃𝐍𝐈 𝐈𝐍𝐅𝐎 + 𝐅𝐎𝐓𝐎", cmds: ["/dni 12345678"], creditos: 1, estado: true },
      { titulo: "𝐃𝐍𝐈 𝐈𝐍𝐅𝐎 + 𝐅𝐎𝐓𝐎 + 𝐅𝐈𝐑𝐌𝐀 𝐘 𝐇𝐔𝐄𝐋𝐋𝐀𝐒", cmds: ["/dnit 12345678"], creditos: 2, estado: true },
      { titulo: "𝐃𝐍𝐈 𝐕𝐈𝐑𝐓𝐔𝐀𝐋 𝐀𝐙𝐔𝐋 - 𝐀𝐌𝐀𝐑𝐈𝐋𝐋𝐎", cmds: ["/dnivir 12345678"], creditos: 6, estado: true },
      { titulo: "𝐃𝐍𝐈 𝐄𝐋𝐄𝐂𝐓𝐑𝐎́𝐍𝐈𝐂𝐎", cmds: ["/dnie 12345678"], creditos: 6, estado: false },
      { titulo: "𝐁𝐔𝐒𝐐𝐔𝐄𝐃𝐀 𝐏𝐎𝐑 𝐍𝐎𝐌𝐁𝐑𝐄𝐒", cmds: ["/nm pedro castillo"], creditos: 2, estado: true },
      { titulo: "𝐂𝟒 𝐁𝐋𝐀𝐍𝐂𝐎 𝐑𝐄𝐍𝐈𝐄𝐂", cmds: ["/c4 12345678"], creditos: 5, estado: true },
      { titulo: "𝐂𝟒 𝐀𝐙𝐔𝐋 𝐑𝐄𝐍𝐈𝐄𝐂", cmds: ["/c4a 12345678"], creditos: 5, estado: true },
      { titulo: "𝐂𝟒 𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐈𝐍𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎́𝐍 𝐑𝐄𝐍𝐈𝐄𝐂", cmds: ["/c4f 12345678"], creditos: 5, estado: true },
    ],
  },
  tel: {
    titulo: "TELEFONÍA [📞]",
    items: [
      { titulo: "𝐓𝐈𝐓𝐔𝐋𝐀𝐑 𝐓𝐄𝐋𝐄𝐅𝐎𝐍𝐎𝐒 𝐎𝐒𝐈𝐏𝐓𝐄𝐋", cmds: ["/telp 987654321"], creditos: 4, estado: true },
      { titulo: "𝐓𝐈𝐓𝐔𝐋𝐀𝐑 𝐂𝐎𝐍 𝐃𝐍𝐈 𝐓𝐈𝐄𝐌𝐏𝐎 𝐑𝐄𝐀𝐋", cmds: ["/teldni 12345678"], creditos: 4, estado: true },
      { titulo: "𝐓𝐄𝐋𝐄𝐅𝐎𝐍𝐎𝐒 𝐆𝐄𝐍𝐄𝐑𝐀𝐋𝐄𝐒", cmds: ["/tels 917402248"], creditos: 3, estado: false },
    ],
  },
  delitos: {
    titulo: "DELITOS [👮]",
    items: [
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐃𝐄 𝐃𝐄𝐍𝐔𝐍𝐂𝐈𝐀𝐒 𝐏𝐎𝐋𝐈𝐂𝐈𝐀𝐋𝐄𝐒 (𝐏𝐃𝐅)", cmds: ["/denuncias 12345678"], creditos: 15, estado: false },
      { titulo: "𝐑𝐄𝐐𝐔𝐈𝐒𝐈𝐓𝐎𝐑𝐈𝐀𝐒 - 𝐑𝐐 (𝐏𝐃𝐅)", cmds: ["/requisitorias 12345678"], creditos: 15, estado: false },
      { titulo: "𝐑𝐄𝐐𝐔𝐈𝐒𝐈𝐓𝐎𝐑𝐈𝐀 𝐕𝐄𝐇𝐈𝐂𝐔𝐋𝐀𝐑 (𝐏𝐃𝐅)", cmds: ["/rqv 12345678"], creditos: 15, estado: false },
      { titulo: "𝐂𝐀𝐑𝐏𝐄𝐓𝐀𝐒 𝐅𝐈𝐒𝐂𝐀𝐋𝐄𝐒 𝐏𝐃𝐅 (𝐌𝐏𝐅𝐍)", cmds: ["/fiscal 12345678"], creditos: 20, estado: false },
      { titulo: "𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐅𝐈𝐒𝐂𝐀𝐋 𝐏𝐃𝐅 (𝐌𝐏𝐅𝐍)", cmds: ["/mpfn 12345678"], creditos: 20, estado: false },
      { titulo: "𝐀𝐍𝐓𝐄𝐂𝐄𝐃𝐄𝐍𝐓𝐄𝐒 𝐏𝐎𝐋𝐈𝐂𝐈𝐀𝐋𝐄𝐒 𝐏𝐃𝐅 (𝐄𝐒𝐈𝐍𝐏𝐎𝐋)", cmds: ["/antecedentes 12345678"], creditos: 20, estado: false },
      { titulo: "𝐅𝐈𝐂𝐇𝐀 𝐏𝐎𝐋𝐈𝐂𝐈𝐀𝐋 𝐏𝐃𝐅 (PNP)", cmds: ["/poli 12345678"], creditos: 20, estado: false },
      { titulo: "𝐑𝐄𝐐𝐔𝐈𝐒𝐈𝐓𝐎𝐑𝐈𝐀 𝐉𝐔𝐃𝐈𝐂𝐈𝐀𝐋 (𝐏𝐃𝐅)", cmds: ["/rq 12345678"], creditos: 20, estado: false },
    ],
  },
  fin: {
    titulo: "FINANCIERO [💰]",
    items: [
      { titulo: "𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐒𝐄𝐍𝐓𝐈𝐍𝐄𝐋 𝐏𝐃𝐅 (𝐈𝐍𝐅𝐎𝐂𝐎𝐑𝐏)", cmds: ["/sentinel 12345678"], creditos: 20, estado: false },
      { titulo: "𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 - 𝐅𝐈𝐍𝐀𝐍𝐂𝐈𝐄𝐑𝐎 𝐄𝐗𝐏𝐑𝐄𝐒𝐒 🔥", cmds: ["/seeker 12345678"], creditos: 20, estado: false },
      { titulo: "𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐅𝐈𝐍𝐀𝐍𝐂𝐈𝐄𝐑𝐎 𝐄𝐗𝐏𝐄𝐑𝐈𝐀𝐍 (𝐈𝐍𝐅𝐎𝐂𝐎𝐑𝐏)", cmds: ["/deudas 12345678"], creditos: 15, estado: false },
    ],
  },
  fam: {
    titulo: "FAMILIARES [👨‍👩‍👧]",
    items: [
      { titulo: "𝐀𝐑𝐁𝐎𝐋 𝐆𝐄𝐍𝐄𝐀𝐋𝐎𝐆𝐈𝐂𝐎", cmds: ["/ag 12345678"], creditos: 4, estado: true },
      { titulo: "𝐅𝐀𝐌𝐈𝐋𝐈𝐀 + 𝐅𝐎𝐓𝐎𝐒 (𝐀𝐑𝐁𝐎𝐋 𝐆𝐄𝐍𝐄𝐀𝐋𝐎𝐆𝐈𝐂𝐎 𝐕𝐈𝐒𝐔𝐀𝐋)", cmds: ["/agv 12345678"], creditos: 10, estado: true },
      { titulo: "𝐈𝐍𝐓𝐄𝐆𝐑𝐀𝐍𝐓𝐄𝐒 𝐃𝐄𝐋 𝐇𝐎𝐆𝐀𝐑 + 𝐅𝐎𝐓𝐎𝐒 (𝐕𝐈𝐒𝐔𝐀𝐋)", cmds: ["/hogar 12345678"], creditos: 10, estado: true },
    ],
  },
  cert: {
    titulo: "CERTIFICADOS [📄]",
    items: [
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐀𝐍𝐓𝐄𝐂𝐄𝐃𝐄𝐍𝐓𝐄𝐒 𝐉𝐔𝐃𝐈𝐂𝐈𝐀𝐋𝐄𝐒", cmds: ["/antj 12345678"], creditos: 5, estado: true },
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐀𝐍𝐓𝐄𝐂𝐄𝐃𝐄𝐍𝐓𝐄𝐒 𝐏𝐎𝐋𝐈𝐂𝐈𝐀𝐋𝐄𝐒", cmds: ["/antp 12345678"], creditos: 5, estado: true },
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐀𝐍𝐓𝐄𝐂𝐄𝐃𝐄𝐍𝐓𝐄𝐒 𝐏𝐄𝐍𝐀𝐋𝐄𝐒", cmds: ["/antpe 12345678"], creditos: 5, estado: true },
    ],
  },
  actas: {
    titulo: "ACTAS [📋]",
    items: [
      { titulo: "𝐀𝐂𝐓𝐀𝐒 𝐃𝐄 𝐍𝐀𝐂𝐈𝐌𝐈𝐄𝐍𝐓𝐎", cmds: ["/actanac 12345678"], creditos: 20, estado: false },
      { titulo: "𝐀𝐂𝐓𝐀𝐒 𝐃𝐄 𝐌𝐀𝐓𝐑𝐈𝐌𝐎𝐍𝐈𝐎", cmds: ["/actamatr 12345678"], creditos: 20, estado: false },
      { titulo: "𝐀𝐂𝐓𝐀𝐒 𝐃𝐄 𝐃𝐄𝐅𝐔𝐍𝐂𝐈𝐎́𝐍", cmds: ["/actadef 12345678"], creditos: 20, estado: false },
    ],
  },
  sunarp: {
    titulo: "SUNARP [🏠]",
    items: [
      { titulo: "𝐒𝐔𝐍𝐀𝐑𝐏 - 𝐓𝐈𝐓𝐔𝐋𝐀𝐑𝐈𝐃𝐀𝐃 𝐏𝐑𝐎𝐏𝐈𝐄𝐃𝐀𝐃𝐄𝐒", cmds: ["/sunarp 12345678"], creditos: 3, estado: false },
      { titulo: "𝐒𝐔𝐍𝐀𝐑𝐏 - 𝐂𝐎𝐏𝐈𝐀 - 𝐏𝐑𝐎𝐏𝐈𝐄𝐃𝐀𝐃𝐄𝐒 𝐏𝐃𝐅", cmds: ["/sunarpdf 12345678"], creditos: 10, estado: false },
      { titulo: "𝐒𝐔𝐍𝐀𝐑𝐏 - 𝐄𝐌𝐏𝐑𝐄𝐒𝐀𝐒 𝐏𝐑𝐎𝐏𝐈𝐄𝐃𝐀𝐃𝐄𝐒 𝐏𝐃𝐅", cmds: ["/bienesruc 20123456789"], creditos: 8, estado: false },
      { titulo: "𝐁𝐈𝐄𝐍𝐄𝐒 𝐒𝐔𝐍𝐀𝐑𝐏 𝐏𝐑𝐎𝐏𝐈𝐄𝐃𝐀𝐃𝐄𝐒 𝐏𝐃𝐅 (𝐏𝐀𝐑𝐓𝐈𝐃𝐀)", cmds: ["/bienesp 12345678"], creditos: 8, estado: false },
      { titulo: "𝐁𝐈𝐄𝐍𝐄𝐒 𝐒𝐔𝐍𝐀𝐑𝐏 𝐏𝐑𝐎𝐏𝐈𝐄𝐃𝐀𝐃𝐄𝐒 𝐏𝐃𝐅", cmds: ["/bienes 12345678"], creditos: 8, estado: false },
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀 𝐒𝐔𝐍𝐀𝐑𝐏 𝐁𝐀𝐒𝐄", cmds: ["/sunarpdb 12345678"], creditos: 3, estado: false },
    ],
  },
  vehiculos: {
    titulo: "VEHICULOS [🚗]",
    items: [
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀 𝐏𝐋𝐀𝐂𝐀", cmds: ["/placa ABC123"], creditos: 5, estado: true },
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀 𝐏𝐋𝐀𝐂𝐀 𝐏𝐃𝐅 - 𝐒𝐔𝐍𝐀𝐑𝐏", cmds: ["/placa_sunarp ABC123"], creditos: 10, estado: true },
      { titulo: "𝐑𝐄𝐐𝐔𝐈𝐒𝐈𝐓𝐎𝐑𝐈𝐀 𝐕𝐄𝐇𝐈𝐂𝐔𝐋𝐀𝐑 (𝐏𝐃𝐅)", cmds: ["/placa_rq ABC123"], creditos: 10, estado: false },
      { titulo: "𝐓𝐀𝐑𝐉𝐄𝐓𝐀 𝐃𝐄 𝐈𝐃𝐄𝐍𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎𝐍 𝐕𝐄𝐇𝐈𝐂𝐔𝐋𝐀𝐑 𝐄𝐋𝐄𝐂𝐓𝐑𝐎𝐍𝐈𝐂𝐀", cmds: ["/tive ABC123"], creditos: 15, estado: false },
      { titulo: "𝐓𝐀𝐑𝐉𝐄𝐓𝐀 𝐃𝐄 𝐈𝐃𝐄𝐍𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎𝐍 𝐕𝐄𝐇𝐈𝐂𝐔𝐋𝐀𝐑 𝐅𝐈𝐒𝐈𝐂𝐀", cmds: ["/placav ABC123"], creditos: 8, estado: false },
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀 𝐑𝐄𝐕𝐈𝐒𝐈𝐎𝐍 𝐓𝐄𝐂𝐍𝐈𝐂𝐀 𝐄𝐍 𝐏𝐃𝐅", cmds: ["/revision ABC123"], creditos: 7, estado: false },
      { titulo: "𝐁𝐎𝐋𝐄𝐓𝐀 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐕𝐀 𝐕𝐄𝐇𝐈𝐂𝐔𝐋𝐀𝐑 - 𝐒𝐔𝐍𝐀𝐑𝐏", cmds: ["/placab ABC123"], creditos: 4, estado: false },
      { titulo: "𝐋𝐈𝐂𝐄𝐍𝐂𝐈𝐀 𝐃𝐄 𝐂𝐎𝐍𝐃𝐔𝐂𝐈𝐑 𝐄𝐋𝐄𝐂𝐓𝐑𝐎𝐍𝐈𝐂𝐀 𝐏𝐃𝐅", cmds: ["/licencia 12345678"], creditos: 5, estado: false },
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐌𝐓𝐂 - 𝐏𝐀𝐏𝐄𝐋𝐄𝐓𝐀𝐒 𝐏𝐃𝐅 ", cmds: ["/mtc 12345678"], creditos: 5, estado: false },
      { titulo: "𝐏𝐀𝐏𝐄𝐋𝐄𝐓𝐀𝐒 𝐒𝐀𝐓", cmds: ["/papeletas ABC123"], creditos: 5, estado: false },
      { titulo: "𝐒𝐎𝐀𝐓 𝐃𝐈𝐆𝐈𝐓𝐀𝐋 𝐄𝐍 𝐏𝐃𝐅", cmds: ["/soat ABC123"], creditos: 10, estado: false },
    ],
  },
  estudios: {
    titulo: "ESTUDIOS [🎓]",
    items: [
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐃𝐄 𝐄𝐒𝐓𝐔𝐃𝐈𝐎𝐒 𝐏𝐃𝐅 (𝐂𝐎𝐍 𝐐𝐑)", cmds: ["/notas 12345678"], creditos: 15, estado: false },
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀 𝐓𝐈𝐓𝐔𝐋𝐎𝐒 𝐔𝐍𝐈𝐕𝐄𝐑𝐒𝐈𝐓𝐀𝐑𝐈𝐎𝐒 𝐒𝐔𝐍𝐄𝐃𝐔 𝐏𝐃𝐅", cmds: ["/sunedu 12345678"], creditos: 3, estado: false },
      { titulo: "𝐂𝐀𝐑𝐍𝐄𝐓 𝐔𝐍𝐈𝐕𝐄𝐑𝐒𝐈𝐓𝐀𝐑𝐈𝐎 𝐕𝐈𝐑𝐓𝐔𝐀𝐋", cmds: ["/universidad 12345678"], creditos: 6, estado: false },
      { titulo: "𝐂𝐀𝐑𝐍𝐄𝐓 𝐔𝐍𝐈𝐕𝐄𝐑𝐒𝐈𝐓𝐀𝐑𝐈𝐎 𝐅𝐀𝐊𝐄", cmds: ["/univ 12345678|Universidad|Carrera|Facultad"], creditos: 6, estado: false },
    ],
  },
  sunat: {
    titulo: "SUNAT [📊]",
    items: [
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐌𝐎𝐒 𝐇𝐎𝐓𝐄𝐋𝐄𝐒 𝐘 𝐑𝐄𝐒𝐓𝐀𝐔𝐑𝐀𝐍𝐓𝐄𝐒 𝐒𝐔𝐍𝐀𝐓", cmds: ["/consumos 12345678"], creditos: 15, estado: false },
      { titulo: "𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀 𝐑𝐔𝐂 𝐒𝐔𝐍𝐀𝐓 𝐏𝐃𝐅", cmds: ["/ruc 20123456789"], creditos: 5, estado: false },
    ],
  },
  migratorios: {
    titulo: "MIGRATORIOS [🌍]",
    items: [
      { titulo: "𝐂𝐄𝐑𝐓𝐈𝐅𝐈𝐂𝐀𝐃𝐎 𝐌𝐈𝐆𝐑𝐀𝐂𝐈𝐎𝐍𝐄𝐒 𝐏𝐃𝐅", cmds: ["/migra 12345678"], creditos: 10, estado: false },
      { titulo: "𝐑𝐄𝐏𝐎𝐑𝐓𝐄 𝐌𝐈𝐆𝐑𝐀𝐓𝐎𝐑𝐈𝐎 𝐏𝐃𝐅 𝐕𝟐", cmds: ["/migrap 12345678"], creditos: 15, estado: false },
      { titulo: "𝐂𝐄́𝐃𝐔𝐋𝐀 𝐕𝐄𝐍𝐄𝐙𝐎𝐋𝐀𝐍𝐀", cmds: ["/cedula 12345678"], creditos: 2, estado: false },
      { titulo: "𝐍𝐎𝐌𝐁𝐑𝐄𝐒 𝐕𝐄𝐍𝐄𝐙𝐎𝐋𝐀𝐍𝐎𝐒", cmds: ["/nmv pedro cardenas rios"], creditos: 1, estado: false },
    ],
  },
  extras: {
    titulo: "EXTRAS [➕]",
    items: [
      { titulo: "𝐑𝐄𝐂𝐎𝐍𝐎𝐂𝐈𝐌𝐈𝐄𝐍𝐓𝐎 𝐅𝐀𝐂𝐈𝐀𝐋 𝐏𝐃𝐅 🔥", cmds: ["/facial"], creditos: 40, estado: false },
      { titulo: "𝐇𝐈𝐒𝐓𝐎𝐑𝐈𝐀𝐋 𝐃𝐄 𝐒𝐄𝐆𝐔𝐑𝐎𝐒 -  𝐈𝐍𝐓𝐄𝐆𝐑𝐀𝐋 𝐃𝐄 𝐒𝐀𝐋𝐔𝐃", cmds: ["/seguro 12345678"], creditos: 2, estado: false },
      { titulo: "𝐁𝐔𝐒𝐐𝐔𝐄𝐃𝐀 𝐃𝐄 𝐂𝐎𝐑𝐑𝐄𝐎𝐒", cmds: ["/correo 12345678"], creditos: 1, estado: false },
      {
        titulo: "𝐕𝐎𝐔𝐂𝐇𝐄𝐑 (𝐘𝐀𝐏𝐄 / 𝐏𝐋𝐈𝐍)",
        cmds: ["/yape 10|Pedro Cas*|987", "/yape 10|Pedro Cas*|987|Texto aquí|Plin", "/plin 10|Pedro Cas*|987"],
        creditos: 0,
        estado: false,
      },
    ],
  },
};

module.exports = {
  IS_PRODUCCION,
  CATEGORIAS_CMDS,
  DOCUMENTOS,
  APP_NAME,
  ASSETS,
};
