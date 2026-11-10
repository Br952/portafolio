/**
 * Capturas reproducibles para el README.
 *
 *   npm run screenshots
 *
 * Hace un build de producción, lo sirve con `vite preview` y captura las
 * vistas que documentan el sitio. Si cambias el diseño, vuelve a ejecutarlo.
 */
import { mkdirSync } from 'node:fs';
import { build, preview } from 'vite';
import { chromium } from '@playwright/test';

const PORT = 4175;
const OUT = 'docs/screenshots';

mkdirSync(OUT, { recursive: true });

// Las capturas siempre se hacen contra la raíz, aunque el último build haya
// sido el de GitHub Pages (que usa `/nombre-del-repo/`).
process.env.VITE_BASE = '/';
await build({ logLevel: 'warn' });

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const url = `http://127.0.0.1:${PORT}/`;
const browser = await chromium.launch();

async function capture({ name, width, height, section, element = false }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // El skip link solo se ve con foco de teclado; en una captura de marketing
    // distrae, así que se oculta solo durante la sesión de Playwright.
    await page.addStyleTag({ content: '[data-testid="skip-link"]{display:none!important}' });
    await page.waitForTimeout(900);

    if (section) {
      const target = page.getByTestId(section);
      await page.evaluate((id) => {
        const el = document.querySelector(`[data-testid="${id}"]`);
        const top = el.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo(0, top);
      }, section);
      await page.waitForTimeout(700);
      await page
        .waitForFunction(
          () => Array.from(document.images).every((img) => img.complete),
          null,
          { timeout: 5000 },
        )
        .catch(() => {});

      if (element) {
        await target.screenshot({ path: `${OUT}/${name}.png` });
      } else {
        await page.screenshot({ path: `${OUT}/${name}.png` });
      }
    } else {
      await page.screenshot({ path: `${OUT}/${name}.png` });
    }

    console.log(`ok  ${name}.png`);
  } finally {
    await page.close();
  }
}

try {
  await capture({ name: 'hero-desktop', width: 1440, height: 900 });
  await capture({
    name: 'projects-desktop',
    width: 1440,
    height: 900,
    section: 'projects-section',
    element: true,
  });
  await capture({
    name: 'contact-desktop',
    width: 1440,
    height: 900,
    section: 'contact-section',
    element: true,
  });
  await capture({ name: 'hero-mobile', width: 390, height: 844 });
  await capture({
    name: 'projects-mobile',
    width: 390,
    height: 844,
    section: 'projects-section',
  });
} finally {
  await browser.close();
  await server.close();
}
