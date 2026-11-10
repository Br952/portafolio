/**
 * Proyectos destacados, basados en trabajo real.
 * `href` es opcional: si no existe, la tarjeta no se convierte en enlace
 * (nunca dejamos anclas muertas).
 */
import { CASE_STUDY_HASH } from './caseStudies';

export const projects = [
  {
    id: 'funvisis',
    index: '01',
    title: 'Monitoreo sísmico nacional',
    summary:
      'Mapa operativo para FUNVISIS: red de 45 estaciones, eventos en vivo e histórico, capas de amenaza y reportes Excel, con un asistente de IA por voz y texto.',
    tags: ['JavaScript', 'Leaflet', 'Node.js'],
    image: '/projects/monitoreo-sismico.png',
    imageAlt:
      'Panel de monitoreo sísmico de Venezuela: mapa de fallas, estaciones sísmicas y eventos recientes sobre Leaflet.',
    metric: { value: '95%', label: 'ahorro operativo' },
    href: CASE_STUDY_HASH,
    hrefLabel: 'Ver caso de estudio',
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
