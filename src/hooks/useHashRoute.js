import { useEffect, useState } from 'react';
import { CASE_STUDY_HASH } from '@/data/caseStudies';

/**
 * Enrutado mínimo por hash, sin dependencias.
 *
 * El sitio sigue siendo un SPA de una sola página: la home usa anclas
 * (`#proyectos`) y el caso de estudio usa una ruta propia
 * (`#/proyectos/monitoreo-sismico`). Las anclas internas del caso
 * (`#caso-*`) también se resuelven como parte del caso para que el
 * índice de contenidos no lo desmonte.
 */
export const ROUTES = {
  home: 'home',
  seismic: 'seismic',
};

export function resolveRoute(hash) {
  if (hash === CASE_STUDY_HASH) return ROUTES.seismic;
  if (hash.startsWith('#caso-')) return ROUTES.seismic;
  return ROUTES.home;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() =>
    typeof window === 'undefined' ? ROUTES.home : resolveRoute(window.location.hash),
  );

  useEffect(() => {
    const handleHashChange = () => setRoute(resolveRoute(window.location.hash));

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}
