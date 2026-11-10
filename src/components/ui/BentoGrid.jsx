import { cn } from '@/lib/cn';

/**
 * Rejilla Bento base. 12 columnas en desktop para permitir asimetría real;
 * las celdas deciden su span. El gap único mantiene el ritmo vertical.
 */
export function BentoGrid({ className, children, ...props }) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCell({ className, children, ...props }) {
  return (
    <div className={cn('min-w-0', className)} {...props}>
      {children}
    </div>
  );
}
