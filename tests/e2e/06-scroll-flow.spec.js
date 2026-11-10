import { test, expect } from '@playwright/test';
import { DESKTOP, gotoHome } from './fixtures/portfolio';

const scrollY = (page) => page.evaluate(() => window.scrollY);

test.describe('Flujo de navegación completo', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await gotoHome(page);
  });

  test('los enlaces del navbar anclan a su sección y la marcan activa', async ({ page }) => {
    for (const id of ['stack', 'proyectos', 'contacto']) {
      await page.getByTestId(`nav-link-${id}`).click();

      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await expect(page.getByTestId(`nav-link-${id}`)).toHaveAttribute('aria-current', 'true');
    }
  });

  test('el CTA del hero lleva a la sección de proyectos', async ({ page }) => {
    await page.getByTestId('hero-cta-projects').click();

    await expect(page).toHaveURL(/#proyectos$/);
    await expect(page.getByTestId('projects-section')).toBeInViewport();
  });

  test('volver a inicio restablece la posición y el estado activo', async ({ page }) => {
    await page.getByTestId('nav-link-proyectos').click();
    await expect(page).toHaveURL(/#proyectos$/);

    await page.getByTestId('nav-link-inicio').click();
    await expect(page).toHaveURL(/#inicio$/);
    await expect.poll(() => scrollY(page)).toBeLessThan(80);
    await expect(page.getByTestId('nav-link-inicio')).toHaveAttribute('aria-current', 'true');
  });

  test('el scroll-spy sigue la sección visible sin depender del clic', async ({ page }) => {
    await page.evaluate(() =>
      document.getElementById('proyectos').scrollIntoView({ behavior: 'instant', block: 'start' }),
    );

    await expect(page.getByTestId('nav-link-proyectos')).toHaveAttribute('aria-current', 'true');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    await expect(page.getByTestId('nav-link-inicio')).toHaveAttribute('aria-current', 'true');
  });

  test('el footer cierra el documento con landmarks correctos', async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
    );

    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeInViewport();
    await expect(footer).toContainText('Brayan Rondón');
  });

  test('el orden de tabulación empieza por el skip link y el logo', async ({ page }) => {
    const order = [];

    for (let index = 0; index < 3; index += 1) {
      await page.keyboard.press('Tab');
      order.push(
        await page.evaluate(
          () =>
            document.activeElement?.getAttribute('data-testid') ??
            document.activeElement?.textContent?.trim().slice(0, 24),
        ),
      );
    }

    expect(order[0]).toBe('skip-link');
    expect(order[1]).toBe('nav-logo');
  });
});
