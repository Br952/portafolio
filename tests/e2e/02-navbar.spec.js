import { test, expect } from '@playwright/test';
import { DESKTOP, gotoHome, MOBILE, openMobileMenu } from './fixtures/portfolio';

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  test('muestra la navegación principal en desktop', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    const links = page.getByTestId('nav-links').getByRole('link');
    await expect(links).toHaveCount(4);

    await expect(page.getByTestId('nav-link-inicio')).toHaveAttribute('href', '#inicio');
    await expect(page.getByTestId('nav-link-proyectos')).toHaveAttribute('href', '#proyectos');
    await expect(page.getByTestId('nav-link-contacto')).toHaveAttribute('href', '#contacto');

    await expect(page.getByTestId('nav-menu-toggle')).toBeHidden();
  });

  test('marca la sección activa con aria-current', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    await expect(page.getByTestId('nav-link-inicio')).toHaveAttribute('aria-current', 'true');
    await expect(page.getByTestId('nav-link-proyectos')).not.toHaveAttribute('aria-current', 'true');
  });

  test('pasa a estado sticky al hacer scroll', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    const navbar = page.getByTestId('navbar');
    await expect(navbar).toHaveAttribute('data-scrolled', 'false');

    await page.evaluate(() => window.scrollTo(0, 300));
    await expect(navbar).toHaveAttribute('data-scrolled', 'true');

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(navbar).toHaveAttribute('data-scrolled', 'false');
  });

  test('abre el menú móvil y devuelve el foco al trigger con Escape', async ({ page }) => {
    await page.setViewportSize(MOBILE);

    const toggle = page.getByTestId('nav-menu-toggle');
    const menu = page.getByTestId('mobile-menu');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    await expect(menu).toHaveAttribute('data-open', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('mobile-nav-link-inicio')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(menu).toHaveAttribute('data-open', 'false');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('bloquea el scroll del documento mientras el menú está abierto', async ({ page }) => {
    await openMobileMenu(page);

    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');

    await page.keyboard.press('Escape');

    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .not.toBe('hidden');
  });

  test('cierra el menú al elegir un enlace', async ({ page }) => {
    const { menu } = await openMobileMenu(page);

    await page.getByTestId('mobile-nav-link-inicio').click();

    await expect(menu).toHaveAttribute('data-open', 'false');
    await expect(page.getByTestId('nav-menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });
});
