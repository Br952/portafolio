import { test, expect } from '@playwright/test';
import { siteConfig } from '../../site.config.js';
import { gotoHome, getHorizontalOverflow, MOBILE, TABLET } from './fixtures/portfolio';

test.describe('Hero', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  test('renderiza el titular y el CTA primario', async ({ page }) => {
    const title = page.getByTestId('hero-title');

    await expect(title).toBeVisible();
    await expect(title).toContainText('Ingeniería web con');
    await expect(title).toContainText('estándar de producto.');

    const cta = page.getByTestId('hero-cta-projects');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Ver proyectos');
    await expect(cta).toHaveAttribute('href', '#proyectos');
  });

  test('expone un único h1 con nombre accesible', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 1 });

    await expect(headings).toHaveCount(1);
    await expect(headings).toHaveAccessibleName(/Ingeniería web con\s+estándar de producto\./);
  });

  test('el CTA de CV enlaza al PDF y es descargable', async ({ page }) => {
    const cta = page.getByTestId('hero-cta-cv');

    await expect(cta).toHaveAttribute('href', '/cv/Brayan-Rondon-CV.pdf');
    await expect(cta).toHaveAttribute('download', '');
  });

  test('muestra las tres métricas de impacto', async ({ page }) => {
    const metrics = page.getByTestId('hero').locator('dl');

    await expect(metrics.locator('dt')).toHaveCount(3);
    await expect(metrics).toContainText('Ahorro operativo');
    await expect(metrics).toContainText('Lighthouse mobile');
  });

  test('la ventana de código comunica el estado de pruebas en verde', async ({ page }) => {
    await expect(page.getByTestId('code-window')).toBeVisible();
    await expect(page.getByTestId('code-window')).toContainText('suite e2e');
    await expect(page.getByTestId('code-window')).toContainText('playwright test');
  });

  test('no produce desbordamiento horizontal en mobile ni tablet', async ({ page }) => {
    for (const viewport of [MOBILE, TABLET]) {
      await page.setViewportSize(viewport);
      await expect(page.getByTestId('hero-title')).toBeVisible();
      expect(await getHorizontalOverflow(page), `overflow en ${viewport.width}px`).toBeLessThanOrEqual(1);
    }
  });

  test('el subtítulo mantiene contraste real sobre el canvas (regresión de tokens)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const subtitle = page.getByTestId('hero').locator('p').first();
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText(siteConfig.tagline.slice(0, 40));

    const color = await subtitle.evaluate((node) => getComputedStyle(node).color);
    expect(color, 'el subtítulo heredó el color del fondo').not.toBe('rgb(11, 15, 25)');
  });
});
