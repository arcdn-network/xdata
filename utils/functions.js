const { Readable } = require("stream");

const toStream = (buffer, filename) => {
  const stream = Readable.from(buffer);
  stream.path = filename;
  return stream;
};

const toPhoto = (base64, filename, caption = null) => ({
  type: "photo",
  media: Buffer.from(base64, "base64"),
  fileOptions: { filename: `${filename}.jpg`, contentType: "image/jpeg" },
  ...(caption && { caption, parse_mode: "HTML" }),
});

const toBuffer = (base64) => Buffer.from(base64, "base64");

const bufferToStream = (buffer, filename) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  stream.path = filename;
  return stream;
};

const extractPdfBuffer = (raw) => {
  const entry = Array.isArray(raw.listaAni) ? raw.listaAni[0] : (raw.listaAni ?? {});
  const b64 = entry.pdf_combinado_base64 ?? raw.pdf_combinado_base64;
  if (!b64) return null;
  return Buffer.from(b64, "base64");
};

module.exports = {
  toPhoto,
  toStream,
  toBuffer,
  bufferToStream,
  extractPdfBuffer,
};
