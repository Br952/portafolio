import { cn } from '@/lib/cn';

/** Superficie base del sistema: glass + borde translúcido + radio consistente. */
export function GlassPanel({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('glass rounded-xl', className)} {...props}>
      {children}
    </Tag>
  );
}
