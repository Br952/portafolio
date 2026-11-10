import { test, expect } from '@playwright/test';
import { DESKTOP, MOBILE, getHorizontalOverflow, gotoHome } from './fixtures/portfolio';

test.describe('Stack y Proyectos', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  test('la sección de stack describe las cuatro disciplinas', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    const stack = page.getByTestId('stack-section');
    await stack.scrollIntoViewIfNeeded();

    await expect(stack.getByRole('heading', { level: 2 })).toHaveText(
      'Herramientas con las que construyo',
    );

    const cards = stack.getByTestId('skill-card');
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toContainText('Frontend Engineering');
    await expect(cards.first().locator('li')).toHaveCount(5);
    await expect(cards.last()).toContainText('Playwright');
  });

  test('renderiza tres proyectos reales con métrica y enlace', async ({ page }) => {
    const cards = page.getByTestId('project-card');
    await expect(cards).toHaveCount(3);

    await expect(cards.first()).toContainText('Monitoreo sísmico nacional');
    await expect(cards.first()).toContainText('95%');
    await expect(cards.first()).toContainText('ahorro operativo');

    const links = page.getByTestId('project-link');
    await expect(links).toHaveCount(3);
    await expect(links.first()).toHaveAttribute('href', '#/proyectos/monitoreo-sismico');
    await expect(links.first()).toContainText('Ver caso de estudio');
    await expect(links.last()).toHaveAttribute('href', 'https://github.com/Br952');
    await expect(links.last()).toHaveAttribute('target', '_blank');
  });

  test('el proyecto destacado muestra una preview accesible', async ({ page }) => {
    const preview = page.getByTestId('project-preview');
    await expect(preview).toHaveCount(1);

    const image = page.getByTestId('project-preview-image');
    if ((await image.count()) > 0) {
      await expect(image).toHaveAttribute('alt', /monitoreo sísmico/i);
    } else {
      await expect(preview).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('las tarjetas conservan el layout en mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.getByTestId('projects-section').scrollIntoViewIfNeeded();

    await expect(page.getByTestId('project-card')).toHaveCount(3);
    expect(await getHorizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('las secciones exponen un único h2 accesible', async ({ page }) => {
    await expect(page.getByTestId('stack-section').getByRole('heading', { level: 2 })).toHaveCount(1);
    await expect(page.getByTestId('projects-section').getByRole('heading', { level: 2 })).toHaveCount(1);
  });
});
