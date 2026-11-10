import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { MOBILE, gotoHome, openMobileMenu } from './fixtures/portfolio';

test.describe('Accesibilidad', () => {
  test('sin violaciones críticas o serias (WCAG 2.1 AA)', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations
      .filter((violation) => ['critical', 'serious'].includes(violation.impact))
      .map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target),
      }));

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('el skip link recibe foco con Tab y salta al contenido', async ({ page }) => {
    await gotoHome(page);

    await page.keyboard.press('Tab');

    const skip = page.getByTestId('skip-link');
    await expect(skip).toBeFocused();

    await skip.press('Enter');
    await expect(page).toHaveURL(/#contenido$/);
  });

  test('el menú móvil atrapa el foco mientras está abierto', async ({ page }) => {
    await gotoHome(page);
    await openMobileMenu(page);

    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const insideMenu = await page.evaluate(() =>
        document.getElementById('mobile-menu')?.contains(document.activeElement),
      );
      expect(insideMenu, `el foco escapó del menú en la iteración ${i}`).toBe(true);
    }
  });

  test('el contenido principal es accesible por landmark', async ({ page }) => {
    await gotoHome(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
  });

  test('respeta prefers-reduced-motion sin ocultar contenido', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);

    await expect(page.getByTestId('hero-title')).toBeVisible();
    await expect(page.getByTestId('code-window')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('el menú móvil es navegable sin desbordar en mobile', async ({ page }) => {
    await gotoHome(page);
    await openMobileMenu(page);

    const panelBox = await page.getByTestId('mobile-menu').boundingBox();
    expect(panelBox.width).toBeLessThanOrEqual(MOBILE.width);
  });
});
