import { test, expect } from '@playwright/test';
import { siteConfig } from '../../site.config.js';
import { DESKTOP, MOBILE, getHorizontalOverflow, gotoHome } from './fixtures/portfolio';

const VALID_MESSAGE =
  'Necesito reconstruir el dashboard de analítica y automatizar las pruebas del flujo de pagos.';

test.describe('Contacto', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await page.setViewportSize(DESKTOP);
  });

  test('muestra la propuesta y el formulario', async ({ page }) => {
    const section = page.getByTestId('contact-section');
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByRole('heading', { level: 2 })).toHaveText(
      'Construyamos algo que aguante producción.',
    );
    await expect(page.getByTestId('contact-form')).toBeVisible();
    await expect(page.getByTestId('contact-submit')).toContainText('Enviar mensaje');
  });

  test('validación vacía: tres errores, foco en el primer campo y aria-invalid', async ({ page }) => {
    await page.getByTestId('contact-form').scrollIntoViewIfNeeded();
    await page.getByTestId('contact-submit').click();

    await expect(page.getByText('Escribe tu nombre (mínimo 2 caracteres).')).toBeVisible();
    await expect(page.getByText('Introduce un email válido')).toBeVisible();
    await expect(page.getByText('Cuéntame un poco más: mínimo 20 caracteres.')).toBeVisible();

    const name = page.getByLabel('Nombre');
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('contact-form')).toHaveAttribute('data-state', 'idle');
  });

  test('detecta un email inválido sin marcar los campos correctos', async ({ page }) => {
    await page.getByLabel('Nombre').fill('Brayan Rondón');
    await page.getByLabel('Email').fill('brayan@');
    await page.getByLabel('Mensaje').fill(VALID_MESSAGE);
    await page.getByTestId('contact-submit').click();

    await expect(page.getByText('Introduce un email válido')).toBeVisible();
    await expect(page.getByText('Escribe tu nombre')).toHaveCount(0);
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('envío correcto: estado de éxito, feedback y campos limpios', async ({ page }) => {
    await page.getByLabel('Nombre').fill('Brayan Rondón');
    await page.getByLabel('Email').fill('brayan@empresa.com');
    await page.getByLabel('Mensaje').fill(VALID_MESSAGE);

    await page.getByTestId('contact-submit').click();

    const form = page.getByTestId('contact-form');
    await expect(form).toHaveAttribute('data-state', 'success');
    await expect(page.getByTestId('contact-feedback')).toContainText(
      'Abrimos tu cliente de correo con el mensaje listo para enviar.',
    );
    await expect(page.getByTestId('contact-submit')).toContainText('Revisa tu correo');

    await expect(page.getByLabel('Nombre')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
    await expect(page.getByLabel('Mensaje')).toHaveValue('');
  });

  test('el email directo y las redes apuntan a destinos reales', async ({ page }) => {
    await expect(page.getByTestId('contact-email')).toHaveAttribute(
      'href',
      'mailto:brayanrondon952@gmail.com',
    );

    const links = page.getByTestId('contact-section').getByRole('link', {
      name: /GitHub|LinkedIn/,
    });
    await expect(links).toHaveCount(2);
    await expect(links.first()).toHaveAttribute('href', 'https://github.com/Br952');

    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('el formulario se apila sin desbordar en mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.getByTestId('contact-section').scrollIntoViewIfNeeded();

    await expect(page.getByLabel('Nombre')).toBeVisible();
    expect(await getHorizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('los assets críticos y el SEO responden correctamente', async ({ page }) => {
    for (const path of [
      '/cv/Brayan-Rondon-CV.pdf',
      '/og-image.png',
      '/brand/favicon-32.png',
      '/brand/mark-light.png',
      '/sitemap.xml',
      '/robots.txt',
    ]) {
      const response = await page.request.get(path);
      expect(response.status(), `${path} no responde 200`).toBe(200);
    }

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${siteConfig.url}/`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${siteConfig.url}/og-image.png`,
    );

    const jsonLd = JSON.parse(
      await page.locator('script[type="application/ld+json"]').textContent(),
    );
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe('Brayan Rondón');
    expect(jsonLd.email).toBe(`mailto:${siteConfig.email}`);
  });

  test('sitemap y robots se derivan del dominio configurado', async ({ page }) => {
    const sitemap = await (await page.request.get('/sitemap.xml')).text();
    const robots = await (await page.request.get('/robots.txt')).text();

    expect(sitemap).toContain(`<loc>${siteConfig.url}/</loc>`);
    expect(robots).toContain(`Sitemap: ${siteConfig.url}/sitemap.xml`);
    expect(robots).not.toContain('Sitemap: /');
  });

  test('el formulario es navegable por teclado y anuncia el estado', async ({ page }) => {
    const form = page.getByTestId('contact-form');
    await form.scrollIntoViewIfNeeded();

    await page.getByLabel('Nombre').focus();
    await page.keyboard.press('Tab');

    await expect(page.getByLabel('Email')).toBeFocused();

    await expect(page.getByTestId('contact-feedback')).toHaveAttribute('aria-live', 'polite');
  });
});
