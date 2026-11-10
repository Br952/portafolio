/**
 * Validación de rendimiento y presupuesto de bundle.
 *
 *   npm run test:perf
 *
 * 1. Comprueba los assets emitidos (gzip real, no estimaciones).
 * 2. Sirve el build con `vite preview` y mide en Chromium con red 4G lenta
 *    y CPU 4x más lenta (mismas condiciones que Lighthouse mobile).
 * 3. Falla con exit code 1 si se rompe algún presupuesto.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const DIST = 'dist/assets';
const PORT = 4174;

const BUDGET = {
  jsGzipKb: 100,
  cssGzipKb: 20,
  fontsKb: 130,
  fontFiles: 3,
  lcpMs: 2500,
  cls: 0.05,
  tbtMs: 200,
};

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

function checkBundle() {
  const files = readdirSync(DIST);
  const gzipSize = (file) => gzipSync(readFileSync(join(DIST, file))).length;

  const js = files.filter((file) => file.endsWith('.js'));
  const css = files.filter((file) => file.endsWith('.css'));
  const fonts = files.filter((file) => file.endsWith('.woff2'));

  const jsKb = kb(js.reduce((total, file) => total + gzipSize(file), 0));
  const cssKb = kb(css.reduce((total, file) => total + gzipSize(file), 0));
  const fontsKb = kb(fonts.reduce((total, file) => total + readFileSync(join(DIST, file)).length, 0));

  const unusedSubsets = fonts.filter((file) =>
    /(cyrillic|greek|vietnamese)/.test(file),
  );

  const checks = [
    ['JS gzip', `${jsKb} kB`, jsKb <= BUDGET.jsGzipKb],
    ['CSS gzip', `${cssKb} kB`, cssKb <= BUDGET.cssGzipKb],
    ['Fuentes', `${fontsKb} kB`, fontsKb <= BUDGET.fontsKb],
    ['Archivos de fuente', String(fonts.length), fonts.length <= BUDGET.fontFiles],
    ['Subsets sin usar', unusedSubsets.length ? unusedSubsets.join(', ') : '0', unusedSubsets.length === 0],
  ];

  return checks;
}

async function measure(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });
  const cdp = await page.context().newCDPSession(page);

  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, tbt: 0 };

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__perf.lcp = entries[entries.length - 1].startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.tbt += Math.max(0, entry.duration - 50);
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const result = await page.evaluate(() => ({ ...window.__perf }));
  await browser.close();
  return result;
}

const bundleChecks = checkBundle();

// En CI solo se valida el peso del bundle: las métricas de laboratorio
// dependen del runner y serían un falso negativo intermitente.
if (process.argv.includes('--bundle-only')) {
  let failed = 0;
  for (const [label, value, pass] of bundleChecks) {
    if (!pass) failed += 1;
    console.log(`${pass ? 'ok  ' : 'FAIL'}  ${label.padEnd(20)} ${value}`);
  }
  console.log(`\n${failed === 0 ? 'Presupuesto de bundle respetado' : `${failed} presupuesto(s) incumplido(s)`}`);
  process.exit(failed === 0 ? 0 : 1);
}

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const url = `http://127.0.0.1:${PORT}`;

const runs = [];
for (let run = 0; run < 3; run += 1) {
  runs.push(await measure(url));
}

await server.close();

const lcp = median(runs.map((run) => run.lcp));
const cls = median(runs.map((run) => run.cls));
const tbt = median(runs.map((run) => run.tbt));

const perfChecks = [
  ['LCP', `${Math.round(lcp)} ms`, lcp <= BUDGET.lcpMs],
  ['CLS', cls.toFixed(3), cls <= BUDGET.cls],
  ['TBT', `${Math.round(tbt)} ms`, tbt <= BUDGET.tbtMs],
];

let failed = 0;
for (const [label, value, pass] of [...bundleChecks, ...perfChecks]) {
  if (!pass) failed += 1;
  console.log(`${pass ? 'ok  ' : 'FAIL'}  ${label.padEnd(20)} ${value}`);
}

console.log(
  `\n${failed === 0 ? 'Presupuesto respetado' : `${failed} presupuesto(s) incumplido(s)`}` +
    ` · ${runs.length} mediciones (mediana) · red 4G / CPU 4x`,
);

process.exit(failed === 0 ? 0 : 1);
