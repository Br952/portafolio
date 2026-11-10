import { cn } from '@/lib/cn';

/**
 * Indicador de disponibilidad. El pulso es funcional (señal de "en vivo")
 * y desaparece por completo con prefers-reduced-motion.
 */
export function StatusPill({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/[0.07] px-3 py-1',
        'font-mono text-[10px] uppercase tracking-[0.16em] text-success',
        className,
      )}
    >
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-success" />
      </span>
      {children}
    </span>
  );
}
