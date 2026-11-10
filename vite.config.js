import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './site.config.js';

// El deploy de GitHub Pages define VITE_SITE_URL con el owner y el repo reales.
// Se muta antes de que los plugins lean el objeto, de modo que canonical, OG,
// JSON-LD, sitemap y robots salen siempre del mismo dominio.
const runtimeSiteUrl = process.env.VITE_SITE_URL?.replace(/\/+$/, '');
if (runtimeSiteUrl) siteConfig.url = runtimeSiteUrl;

/**
 * Los dos pesos que pintan el primer viewport (títulos y copy) se precargan
 * en build. Sin esto, la fuente llegaba después del primer paint y el hero
 * reflowaba: era el origen de prácticamente todo el CLS mobile.
 */
function preloadCriticalFonts() {
  const critical = [/plus-jakarta-sans-latin-wght-normal/, /inter-latin-wght-normal/];
  const base = process.env.VITE_BASE ?? '/';

  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((file) =>
        critical.some((pattern) => pattern.test(file)),
      );

      if (!files.length) return html;

      // Se insertan justo después de <meta charset>, antes del CSS: el
      // preload scanner las ve en el primer tramo del documento.
      const links = files
        .map(
          (file) =>
            `<link rel="preload" as="font" type="font/woff2" href="${base}${file}" crossorigin="anonymous">`,
        )
        .join('\n    ');

      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    ${links}`,
      );
    },
  };
}

/**
 * Un solo origen para canonical, Open Graph, Twitter Card y JSON-LD.
 * index.html no guarda metadatos duplicados: cambiando site.config.js
 * cambia el sitio entero, incluido el sitemap.
 */
function injectSiteMeta() {
  const { seo, socials } = siteConfig;
  // Sin quitar la barra inicial, `/og-image.png` se resolvería contra el
  // dominio y perdería el subpath de GitHub Pages (`/portafolio/`).
  const absolute = (path) => new URL(String(path).replace(/^\/+/, ''), `${siteConfig.url}/`).href;

  const tags = [
    { tag: 'title', children: seo.title, injectTo: 'head' },
    {
      tag: 'meta',
      attrs: { name: 'description', content: seo.description },
      injectTo: 'head',
    },
    {
      tag: 'link',
      attrs: { rel: 'canonical', href: absolute('/') },
      injectTo: 'head',
    },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:locale', content: seo.locale }, injectTo: 'head' },
    {
      tag: 'meta',
      attrs: { property: 'og:site_name', content: siteConfig.name },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { property: 'og:url', content: absolute('/') },
      injectTo: 'head',
    },
    { tag: 'meta', attrs: { property: 'og:title', content: seo.title }, injectTo: 'head' },
    {
      tag: 'meta',
      attrs: { property: 'og:description', content: seo.ogDescription },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { property: 'og:image', content: absolute(seo.image) },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { property: 'og:image:width', content: '1200' },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { property: 'og:image:height', content: '630' },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { property: 'og:image:alt', content: seo.imageAlt },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { name: 'twitter:card', content: seo.twitterCard },
      injectTo: 'head',
    },
    { tag: 'meta', attrs: { name: 'twitter:title', content: seo.title }, injectTo: 'head' },
    {
      tag: 'meta',
      attrs: { name: 'twitter:description', content: seo.ogDescription },
      injectTo: 'head',
    },
    {
      tag: 'meta',
      attrs: { name: 'twitter:image', content: absolute(seo.image) },
      injectTo: 'head',
    },
    {
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      children: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteConfig.name,
          jobTitle: siteConfig.role,
          url: absolute('/'),
          email: `mailto:${siteConfig.email}`,
          knowsAbout: seo.knowsAbout,
          sameAs: socials.map((social) => social.href),
        },
        null,
        2,
      ),
      injectTo: 'head',
    },
  ];

  return {
    name: 'inject-site-meta',
    transformIndexHtml() {
      return { tags };
    },
  };
}

const sitemapXml = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.url}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const robotsTxt = () => `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;

/**
 * `/sitemap.xml` y `/robots.txt` se derivan del dominio configurado. En dev
 * los sirve un middleware para que las pruebas E2E los vean; en build se
 * emiten como assets del bundle.
 */
function seoFiles() {
  const routes = {
    '/sitemap.xml': ['application/xml; charset=utf-8', sitemapXml],
    '/robots.txt': ['text/plain; charset=utf-8', robotsTxt],
  };

  return {
    name: 'seo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        const route = path ? routes[path] : undefined;
        if (!route) return next();

        const [contentType, render] = route;
        res.setHeader('Content-Type', contentType);
        res.end(render());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() });
    },
  };
}

export default defineConfig({
  // En GitHub Pages el sitio vive en /nombre-del-repo/; el workflow define
  // VITE_BASE. En Vercel o dominio propio la base es "/".
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), injectSiteMeta(), preloadCriticalFonts(), seoFiles()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
});
