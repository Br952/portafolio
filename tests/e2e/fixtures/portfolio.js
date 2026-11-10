import { expect } from '@playwright/test';

export const DESKTOP = { width: 1440, height: 900 };
export const TABLET = { width: 768, height: 1024 };
export const MOBILE = { width: 390, height: 844 };

/** Navega y espera al elemento crítico del Hero (evita carreras de hidratación). */
export async function gotoHome(page) {
  await page.goto('/');
  await expect(page.getByTestId('hero')).toBeVisible();
}

/** Abre el panel móvil y devuelve sus handles más usados. */
export async function openMobileMenu(page) {
  await page.setViewportSize(MOBILE);

  const toggle = page.getByTestId('nav-menu-toggle');
  const menu = page.getByTestId('mobile-menu');

  await toggle.click();
  await expect(menu).toHaveAttribute('data-open', 'true');

  return { toggle, menu };
}

/** Desbordamiento horizontal del documento en px (0 = layout sano). */
export function getHorizontalOverflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
