import { cn } from '@/lib/cn';

/** Primer elemento del DOM: permite saltar el navbar con una sola tecla. */
export function SkipLink({ className }) {
  return (
    <a href="#contenido" data-testid="skip-link" className={cn('skip-link', className)}>
      Saltar al contenido
    </a>
  );
}
