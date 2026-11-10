/**
 * Métricas del Hero. Todas son medibles y defendibles:
 *  - 95 % de ahorro operativo: reportes de FUNVISIS (hojas de cálculo → segundos).
 *  - 99 Lighthouse mobile: medido sobre este build (`npm run test:perf`).
 *  - 1.9 s LCP: mediana de tres corridas con red 4G y CPU 4x más lenta.
 */
export const heroMetrics = [
  {
    value: '95',
    suffix: '%',
    label: 'Ahorro operativo',
    note: 'reportes FUNVISIS',
  },
  {
    value: '99',
    suffix: '',
    label: 'Lighthouse mobile',
    note: 'este portafolio',
  },
  {
    value: '1.9',
    suffix: 's',
    label: 'LCP mobile',
    note: 'red 4G · CPU 4x',
  },
];
