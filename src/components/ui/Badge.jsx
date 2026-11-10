import { cn } from '@/lib/cn';

/** Etiqueta técnica compacta, monoespaciada, para metadata y stacks. */
export function Badge({ children, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-ink/10 bg-ink/[0.03] px-2 py-0.5',
        'font-mono text-[11px] leading-5 text-muted-strong',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
