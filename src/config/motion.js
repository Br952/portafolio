/**
 * Sistema de movimiento compartido. Ninguna animación debe superar
 * los 320 ms salvo las entradas de viewport (700 ms por presupuesto visual).
 */
export const motion = {
  duration: {
    instant: 120,
    fast: 180,
    base: 220,
    slow: 320,
    reveal: 700,
  },
  ease: {
    expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stagger: 70,
};
