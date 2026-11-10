/**
 * Prefija una ruta pública con la base del despliegue.
 *
 * En Vercel o dominio propio la base es `/`; en GitHub Pages es
 * `/nombre-del-repo/`. Sin esto, `/cv/...` o `/brand/...` darían 404 en
 * Pages aunque el build sea correcto.
 */
export function asset(path) {
  const base = import.meta.env.BASE_URL;
  return `${base}${String(path).replace(/^\//, '')}`;
}
