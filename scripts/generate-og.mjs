/**
 * Genera public/og-image.png (1200×630) a partir de site.config.js.
 *
 *   npm run og:generate
 *
 * Se ejecuta a mano cuando cambian nombre, rol, titular o stack. Usa las
 * fuentes reales del proyecto y no depende de servicios externos.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { siteConfig } from '../site.config.js';

const fontUrl = (packageName, file) =>
  pathToFileURL(
    join(process.cwd(), 'node_modules', '@fontsource-variable', packageName, 'files', file),
  ).href;

const jakarta = fontUrl('plus-jakarta-sans', 'plus-jakarta-sans-latin-wght-normal.woff2');
const mono = fontUrl('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2');

const stack = siteConfig.stack.slice(0, 4).join(' <b>·</b> ');

const mark = `data:image/png;base64,${readFileSync('public/brand/mark-light.png').toString('base64')}`;

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: 'Jakarta';
        src: url('${jakarta}') format('woff2');
        font-weight: 200 800;
        font-display: block;
      }
      @font-face {
        font-family: 'JetBrains';
        src: url('${mono}') format('woff2');
        font-weight: 100 800;
        font-display: block;
      }

      * { margin: 0; box-sizing: border-box; }

      body {
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #0b0f19;
        color: #f8fafc;
        font-family: 'Jakarta', system-ui, sans-serif;
        position: relative;
      }

      .glow {
        position: absolute;
        width: 900px;
        height: 900px;
        left: -220px;
        top: -520px;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.16);
        filter: blur(120px);
      }

      .grid {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(248, 250, 252, 0.18) 1px, transparent 1px);
        background-size: 28px 28px;
        mask-image: radial-gradient(ellipse 70% 70% at 30% 0%, black, transparent 72%);
        opacity: 0.5;
      }

      .frame {
        position: absolute;
        inset: 0;
        padding: 64px 72px;
        display: flex;
        flex-direction: column;
      }

      .top { display: flex; align-items: center; gap: 16px; }

      .mark {
        height: 58px;
        width: auto;
        display: block;
      }

      .who { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
      .who span { color: #38bdf8; }
      .role {
        font-family: 'JetBrains', monospace;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #94a3b8;
        margin-top: 4px;
      }

      h1 {
        margin-top: auto;
        font-size: 78px;
        line-height: 1.03;
        letter-spacing: -0.04em;
        font-weight: 800;
        max-width: 1000px;
      }

      h1 em {
        font-style: normal;
        background-image: linear-gradient(100deg, #f8fafc 8%, #7dd3fc 52%, #38bdf8 88%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .footer {
        margin-top: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid rgba(100, 116, 139, 0.28);
        padding-top: 26px;
      }

      .stack {
        font-family: 'JetBrains', monospace;
        font-size: 14px;
        color: #94a3b8;
        letter-spacing: 0.04em;
      }

      .stack b { color: #38bdf8; font-weight: 500; }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        border: 1px solid rgba(16, 185, 129, 0.3);
        background: rgba(16, 185, 129, 0.08);
        color: #10b981;
        border-radius: 999px;
        padding: 8px 14px;
        font-family: 'JetBrains', monospace;
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .dot { width: 6px; height: 6px; border-radius: 999px; background: #10b981; }
    </style>
  </head>
  <body>
    <div class="glow"></div>
    <div class="grid"></div>

    <div class="frame">
      <div class="top">
        <img class="mark" src="${mark}" alt="" />
        <div>
          <div class="who">${siteConfig.name}<span>.</span></div>
          <div class="role">${siteConfig.role}</div>
        </div>
      </div>

      <h1>${siteConfig.headline.lead}<br /><em>${siteConfig.headline.accent}</em></h1>

      <div class="footer">
        <div class="stack">${stack}</div>
        <div class="pill"><span class="dot"></span> Disponible · 2026</div>
      </div>
    </div>
  </body>
</html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-image-'));
const file = join(dir, 'og.html');
writeFileSync(file, html, 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

try {
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/og-image.png' });
} finally {
  await browser.close();
  rmSync(dir, { recursive: true, force: true });
}

console.log('public/og-image.png actualizado');
