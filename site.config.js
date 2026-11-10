/**
 * Fuente única de identidad, contacto y SEO.
 *
 * Se consume desde tres lugares:
 *  - la app (`src/config/site.js`),
 *  - `vite.config.js`, que genera canonical, Open Graph, Twitter Card y
 *    JSON-LD en el HTML final,
 *  - y los assets de SEO (`/sitemap.xml`, `/robots.txt`), emitidos en build
 *    y servidos en dev por el mismo plugin.
 *
 * Cambiar `url` o `email` aquí actualiza todo el sitio: no hay metadatos
 * duplicados en index.html que se puedan quedar desfasados.
 */
export const siteConfig = {
  name: 'Brayan Rondón',
  fullName: 'Brayan Nilson Rondón Vargas',
  firstName: 'Brayan',
  initials: 'BR',
  role: 'Full Stack Engineer',
  availability: 'Disponible para nuevos proyectos',
  location: 'Guatire, Venezuela · Remoto',

  /**
   * URL pública de producción, sin barra final.
   *
   * Por defecto apunta a GitHub Pages. El workflow de despliegue la
   * sobrescribe con `VITE_SITE_URL` a partir del owner y el nombre real del
   * repositorio, así que renombrar el repo no rompe canonical, OG ni sitemap.
   * Para un dominio propio basta con cambiar esta línea.
   */
  url: 'https://br952.github.io/portafolio',
  email: 'brayanrondon952@gmail.com',
  resume: '/cv/Brayan-Rondon-CV.pdf',

  headline: {
    lead: 'Ingeniería web con',
    accent: 'estándar de producto.',
  },
  tagline:
    'Desarrollo aplicaciones web y visualizaciones de datos con React y Python: mapas interactivos, reportes automatizados e interfaces que aguantan producción.',

  socials: [
    { label: 'GitHub', href: 'https://github.com/Br952' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/brayan-rondon-vargas-33937a383',
    },
  ],

  stack: ['React', 'Python', 'PostgreSQL', 'Tailwind CSS', 'Leaflet', 'Docker'],

  seo: {
    title: 'Brayan Rondón — Full Stack Engineer',
    description:
      'Portafolio de Brayan Rondón: aplicaciones web con React y Python, visualización de datos con Leaflet y GeoJSON, y automatización de reportes operativos.',
    ogDescription:
      'React y Python para productos web con datos reales: visualización geoespacial, automatización y rendimiento medido.',
    image: '/og-image.png',
    imageAlt: 'Brayan Rondón — Ingeniería web con estándar de producto',
    locale: 'es_ES',
    twitterCard: 'summary_large_image',
    knowsAbout: [
      'React',
      'JavaScript',
      'Python',
      'PostgreSQL',
      'SQL',
      'Leaflet',
      'GeoJSON',
      'Tailwind CSS',
      'Docker',
      'n8n',
    ],
  },
};
