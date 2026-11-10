import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Entrada por viewport con IntersectionObserver (una sola vez).
 * El movimiento se delega a CSS: el componente solo alterna estados
 * para que la animación corra en el compositor.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-expo',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 will-change-transform motion-reduce:translate-y-0 motion-reduce:opacity-100',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
