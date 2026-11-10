import { useEffect, useMemo, useState } from 'react';

/**
 * Devuelve el id de la sección visible. Usa IntersectionObserver (sin
 * listeners de scroll) y desempata por ratio de intersección para que
 * secciones altas no roben el estado activo.
 */
export function useScrollSpy(ids, { offset = 88 } = {}) {
  const key = ids.join(',');
  const stableIds = useMemo(() => key.split(',').filter(Boolean), [key]);
  const [activeId, setActiveId] = useState(stableIds[0] ?? null);

  useEffect(() => {
    const sections = stableIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      setActiveId(null);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') return;

    // Se acumulan los ratios de todas las secciones visibles: así el estado
    // activo no depende de qué entrada disparó el callback.
    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ratios.set(entry.target.id, entry.intersectionRatio);
          } else {
            ratios.delete(entry.target.id);
          }
        });

        if (!ratios.size) return;

        const [leadingId] = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        setActiveId(leadingId);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [stableIds, offset]);

  return activeId;
}
