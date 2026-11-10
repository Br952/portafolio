import { useEffect } from 'react';

/**
 * Bloquea el scroll del documento sin salto visual: compensa el ancho
 * de la scrollbar para que el layout no se desplace al abrir overlays.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}
