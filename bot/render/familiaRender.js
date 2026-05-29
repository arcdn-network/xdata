const { ASSETS } = require('../../utils/constants');
const puppeteer = require('puppeteer');
const path = require('path');

const PUPPETEER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];
const TEMPLATES_DIR = path.resolve(__dirname, ASSETS);
const RENDER_DELAY = 800;

// Abre browser, crea página, ejecuta el callback y cierra
const withPage = async (viewport, htmlFile, raw, fn) => {
  const browser = await puppeteer.launch({ args: PUPPETEER_ARGS, headless: 'new' });

  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(`file://${path.join(TEMPLATES_DIR, htmlFile)}`, { waitUntil: 'networkidle0' });
    await page.evaluate((data) => window.renderFromData(data), raw);
    await new Promise((resolve) => setTimeout(resolve, RENDER_DELAY));
    return await fn(page);
  } finally {
    await browser.close();
  }
};

async function renderTemplate(raw, template) {
  return withPage({ width: 1440, height: 900, deviceScaleFactor: 3 }, template, raw, async (page) => {
    const container = await page.$('.container');
    return container.screenshot({ type: 'png' });
  });
}

const renderArbol = (raw) => renderTemplate(raw, 'familia_arbol.html');
const renderHogar = (raw) => renderTemplate(raw, 'familia_hogar.html');

module.exports = { renderArbol, renderHogar };
