import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DESKTOP, MOBILE, getHorizontalOverflow, gotoHome } from './fixtures/portfolio';

const CASE_HASH = '#/proyectos/monitoreo-sismico';

async function openCaseStudy(page) {
  await gotoHome(page);
  await page.getByTestId('project-link').first().click();
  await expect(page.getByTestId('case-study')).toBeVisible();
}

test.describe('Caso de estudio · Monitoreo sísmico', () => {
  test('se abre desde la tarjeta y expone un único h1', async ({ page }) => {
    await openCaseStudy(page);

    expect(new URL(page.url()).hash).toBe(CASE_HASH);

    const headings = page.getByRole('heading', { level: 1 });
    await expect(headings).toHaveCount(1);
    await expect(headings).toHaveAccessibleName(/sismicidad de un país/i);

    await expect(page.getByTestId('case-study-title')).toBeFocused();
    await expect(page).toHaveTitle(/Monitor sísmico FUNVISIS/);
  });

  test('el skip link salta al contenido sin desmontar el caso', async ({ page }) => {
    await openCaseStudy(page);

    const skip = page.getByTestId('skip-link');
    await expect(skip).toHaveAttribute('href', '#caso-contenido');

    await skip.focus();
    await skip.press('Enter');

    await expect(page.getByTestId('case-study')).toBeVisible();
    expect(new URL(page.url()).hash).toBe('#caso-contenido');
  });

  test('la captura real del monitor carga completa', async ({ page }) => {
    await openCaseStudy(page);

    const image = page.getByTestId('case-study-hero-image');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', /monitoreo sísmico|monitor sísmico/i);

    await expect
      .poll(() => image.evaluate((node) => node.naturalWidth), { timeout: 5000 })
      .toBeGreaterThan(1000);
  });

  test('recorre problema, rol, solución, arquitectura, decisiones y resultados', async ({ page }) => {
    await openCaseStudy(page);

    const sections = [
      'case-study-problem',
      'case-study-role',
      'case-study-solution',
      'case-study-architecture',
      'case-study-decisions',
      'case-study-results',
      'case-study-learnings',
    ];

    for (const id of sections) {
      const section = page.getByTestId(id);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
      await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1);
    }

    await expect(page.getByTestId('case-study-feature')).toHaveCount(9);
  });

  test('el índice interno navega sin desmontar el caso', async ({ page }) => {
    await openCaseStudy(page);

    await page.getByRole('link', { name: /Arquitectura/ }).click();

    await expect(page.getByTestId('case-study')).toBeVisible();
    expect(new URL(page.url()).hash).toBe('#caso-arquitectura');
    await expect(page.getByTestId('case-study-architecture')).toBeInViewport();

    await page.getByRole('link', { name: /Problema/ }).click();
    await expect(page.getByTestId('case-study-problem')).toBeInViewport();
  });

  test('el enlace de vuelta restaura la home en proyectos', async ({ page }) => {
    await openCaseStudy(page);

    await page.getByTestId('case-study-back').click();

    expect(new URL(page.url()).hash).toBe('#proyectos');
    await expect(page.getByTestId('case-study')).toHaveCount(0);
    await expect(page.getByTestId('projects-section')).toBeVisible();
    await expect(page.getByTestId('project-card')).toHaveCount(3);
  });

  test('la ruta directa funciona y actualiza la meta descripción', async ({ page }) => {
    await page.goto(`/${CASE_HASH}`);

    await expect(page.getByTestId('case-study')).toBeVisible();
    await expect
      .poll(() => page.locator('meta[name="description"]').getAttribute('content'))
      .toContain('mapa de monitoreo sísmico');
  });

  test('no produce desbordamiento horizontal en mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`/${CASE_HASH}`);
    await expect(page.getByTestId('case-study-title')).toBeVisible();

    expect(await getHorizontalOverflow(page)).toBeLessThanOrEqual(1);

    await page.getByTestId('case-study-solution').scrollIntoViewIfNeeded();
    expect(await getHorizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('el layout de escritorio mantiene el hero y la captura legibles', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/${CASE_HASH}`);

    const image = page.getByTestId('case-study-hero-image');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeInViewport();
    expect(await getHorizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('sin violaciones críticas o serias (WCAG 2.1 AA)', async ({ page }) => {
    await page.goto(`/${CASE_HASH}`);
    await expect(page.getByTestId('case-study')).toBeVisible();

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
});
