import { useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tarjeta con foco de luz que sigue al puntero. El cálculo se hace por
 * requestAnimationFrame y solo escribe custom properties: cero reflow
 * por movimiento y sin listeners en el documento.
 *
 * El resplandor usa z-index negativo dentro de un stacking context propio:
 * queda por encima del fondo de la tarjeta y por debajo del contenido,
 * sin envolver a los hijos en un div extra (así mt-auto/flex-1 siguen
 * funcionando en las tarjetas que la consumen).
 */
export function SpotlightCard({ as: Tag = 'div', className, children, ...props }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const handlePointerMove = (event) => {
    const node = ref.current;
    if (!node || event.pointerType === 'touch' || frame.current) return;

    const { clientX, clientY } = event;

    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--spot-x', `${clientX - rect.left}px`);
      node.style.setProperty('--spot-y', `${clientY - rect.top}px`);
    });
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={handlePointerMove}
      className={cn('group/spot relative isolate overflow-hidden', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 ease-out group-hover/spot:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(56 189 248 / 0.10), transparent 68%)',
        }}
      />
      {children}
    </Tag>
  );
}
