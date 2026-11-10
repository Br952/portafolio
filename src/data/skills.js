/**
 * Disciplinas de ingeniería, alineadas al CV y al trabajo real.
 * El icono se resuelve en el componente para mantener los datos
 * serializables.
 */
export const skillGroups = [
  {
    id: 'frontend',
    icon: 'layers',
    title: 'Frontend Engineering',
    description:
      'Interfaces que se sienten instantáneas: componentes React, estilos utilitarios y detalle de UI/UX en cada breakpoint.',
    items: ['React.js', 'JavaScript ES6+', 'Tailwind CSS', 'HTML5', 'UI/UX responsivo'],
    span: 'lg:col-span-7',
  },
  {
    id: 'backend',
    icon: 'database',
    title: 'Backend & Data',
    description:
      'Python y SQL para modelar datos críticos: estructuras claras, consultas medidas y esquemas que no se rompen al crecer.',
    items: ['Python', 'PostgreSQL', 'SQL', 'Modelado UML/BPMN'],
    span: 'lg:col-span-5',
  },
  {
    id: 'dataviz',
    icon: 'map',
    title: 'Data Visualization',
    description:
      'Datos que se leen de un vistazo: mapas interactivos con Leaflet, geometrías GeoJSON y exportaciones con SheetJS.',
    items: ['Leaflet.js', 'GeoJSON', 'SheetJS', 'Data parsing'],
    span: 'lg:col-span-5',
  },
  {
    id: 'delivery',
    icon: 'gauge',
    title: 'Automation & Delivery',
    description:
      'Menos trabajo manual y releases repetibles: flujos con n8n, contenedores Docker y pruebas E2E antes de publicar.',
    items: ['n8n', 'Docker', 'Git/GitHub', 'Vercel', 'Playwright'],
    span: 'lg:col-span-7',
  },
];
