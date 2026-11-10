/**
 * Concatenador de clases sin dependencias. Filtra falsy y aplana arrays.
 * Evita conflictos porque cada componente expone variantes cerradas.
 */
export function cn(...values) {
  return values.flat(Infinity).filter(Boolean).join(' ');
}
