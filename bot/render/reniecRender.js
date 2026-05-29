const { ASSETS, DOCUMENTOS } = require("../../utils/constants");
const { PDFDocument } = require("pdf-lib");
const puppeteer = require("puppeteer");
const path = require("path");

const PUPPETEER_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];
const TEMPLATES_DIR = path.resolve(__dirname, ASSETS);
const RENDER_DELAY = 800;

const extractData = (raw) => (Array.isArray(raw.listaAni) ? raw.listaAni[0] : raw.listaAni);

// CORE: render genérico
const withPage = async (data, viewport, htmlFile, fn) => {
  const browser = await puppeteer.launch({ args: PUPPETEER_ARGS, headless: "new" });

  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(`file://${path.join(TEMPLATES_DIR, htmlFile)}`, { waitUntil: "networkidle0" });
    await page.evaluate((d) => window.renderFromData(d), data);
    await new Promise((resolve) => setTimeout(resolve, RENDER_DELAY));
    return await fn(page);
  } finally {
    await browser.close();
  }
};

// PNG → PDF
const pngToPdf = async (png) => {
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(png);
  const { width, height } = pngImage.scale(0.5);
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(pngImage, { x: 0, y: 0, width, height });
  return Buffer.from(await pdfDoc.save());
};

// DNI VIRTUAL
async function renderDniVirtual(raw) {
  const d = extractData(raw);
  console.log(d);

  const data = { ...raw, listaAni: [d] };
  const viewport = { width: 1240, height: 1800, deviceScaleFactor: 2 };
  const htmlFile = "dni_virtual.html";

  return withPage(data, viewport, htmlFile, async (page) => ({
    anverso: await (await page.$("#anverso")).screenshot({ type: "png" }),
    reverso: await (await page.$("#reverso")).screenshot({ type: "png" }),
  }));
}

// DOCUMENTO GENÉRICO (C4 + ANTECEDENTES)
async function renderDocumento(raw, tipo) {
  const d = extractData(raw);

  const config = DOCUMENTOS[tipo];
  if (!config) {
    throw new Error(`Plantilla no encontrada para tipo: ${tipo}`);
  }

  const data = { ...raw, listaAni: [d] };
  const viewport = { width: 1400, height: 1800, deviceScaleFactor: 2 };
  const htmlFile = config.html;

  const png = await withPage(data, viewport, htmlFile, async (page) => {
    const el = await page.$(".page");
    return el.screenshot({ type: "png" });
  });

  return pngToPdf(png);
}

module.exports = {
  renderDniVirtual,
  renderDocumento,
};
