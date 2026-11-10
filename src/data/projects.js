/**
 * Proyectos destacados, basados en trabajo real.
 * `href` es opcional: si no existe, la tarjeta no se convierte en enlace
 * (nunca dejamos anclas muertas).
 */
export const projects = [
  {
    id: 'funvisis',
    index: '01',
    title: 'Monitoreo sísmico nacional',
    summary:
      'SPA para el seguimiento de eventos sísmicos en Venezuela: mapas interactivos con Leaflet sobre GeoJSON, filtros por magnitud y una interfaz pensada para leer datos rápido.',
    tags: ['React', 'Leaflet', 'GeoJSON'],
    image: '/projects/monitoreo-sismico.png',
    imageAlt:
      'Panel de monitoreo sísmico de Venezuela: mapa de fallas, estaciones sísmicas y eventos recientes sobre Leaflet.',
    metric: { value: '95%', label: 'ahorro operativo' },
    href: '#contacto',
    hrefLabel: 'Solicitar caso',
    featured: true,
  },
  {
    id: 'reportes',
    index: '02',
    title: 'Reportes sísmicos automatizados',
    summary:
      'Generación de reportes con SheetJS a partir de datos crudos: de horas de trabajo manual a segundos, sin hojas intermedias ni errores de copia.',
    tags: ['SheetJS', 'Automatización', 'Datos'],
    metric: { value: 'horas → s', label: 'por reporte' },
    href: '#contacto',
    hrefLabel: 'Solicitar caso',
  },
  {
    id: 'portafolio',
    index: '03',
    title: 'Portafolio de ingeniería',
    summary:
      'Este sitio: React 19 y Tailwind v4 con suite E2E completa, accesibilidad AA y un presupuesto de rendimiento que falla el build si se rompe.',
    tags: ['React', 'Tailwind', 'Playwright'],
    metric: { value: '99', label: 'Lighthouse mobile' },
    href: 'https://github.com/Br952',
    hrefLabel: 'Ver GitHub',
  },
];
