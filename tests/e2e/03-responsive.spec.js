import { test, expect } from '@playwright/test';
import { DESKTOP, MOBILE, TABLET, getHorizontalOverflow, gotoHome } from './fixtures/portfolio';

test.describe('Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  test('no hay desbordamiento horizontal en ningún breakpoint', async ({ page }) => {
    for (const viewport of [MOBILE, TABLET, DESKTOP]) {
      await page.setViewportSize(viewport);
      await expect(page.getByTestId('hero-title')).toBeVisible();
      expect(
        await getHorizontalOverflow(page),
        `overflow en ${viewport.width}x${viewport.height}`,
      ).toBeLessThanOrEqual(1);
    }
  });

  test('el trigger móvil solo existe bajo el breakpoint lg', async ({ page }) => {
    const toggle = page.getByTestId('nav-menu-toggle');

    await page.setViewportSize(MOBILE);
    await expect(toggle).toBeVisible();
    await expect(page.getByTestId('nav-cta')).toBeVisible();

    await page.setViewportSize(DESKTOP);
    await expect(toggle).toBeHidden();
    await expect(page.getByTestId('nav-links')).toBeVisible();
  });

  test('el acceso al CV del navbar se oculta en mobile para no saturar la barra', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await expect(page.getByRole('link', { name: 'CV', exact: true })).toBeHidden();

    await page.setViewportSize(DESKTOP);
    await expect(page.getByRole('link', { name: 'CV', exact: true })).toBeVisible();
  });

  test('los CTA cumplen el tamaño táctil mínimo de 44px', async ({ page }) => {
    await page.setViewportSize(MOBILE);

    for (const id of ['hero-cta-projects', 'hero-cta-cv']) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box, `${id} sin caja`).not.toBeNull();
      expect(box.height, `${id} demasiado bajo`).toBeGreaterThanOrEqual(44);
    }
  });
});
