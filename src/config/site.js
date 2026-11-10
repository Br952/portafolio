import { siteConfig } from '../../site.config.js';
import { asset } from '@/lib/asset';

/**
 * Datos de identidad y contacto. El contenido canónico vive en
 * `site.config.js` (raíz) para que la app y la generación de SEO lean
 * exactamente lo mismo.
 *
 * Aquí solo se añade lo que depende del entorno de Vite.
 */
export const site = {
  ...siteConfig,
  // El workflow de Pages define VITE_SITE_URL; en local se usa el default.
  url: (import.meta.env.VITE_SITE_URL ?? siteConfig.url).replace(/\/+$/, ''),
  resume: asset(siteConfig.resume),
  /**
   * Endpoint de contacto. Vacío = fallback mailto.
   * Ej.: VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxx
   */
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT ?? null,
};

export const stack = siteConfig.stack;
