import { cn } from '@/lib/cn';

/** Cabecera de sección reutilizable: kicker técnico + título + apoyo. */
export function SectionHeading({ kicker, title, titleId, description, className }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {kicker ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{kicker}</p>
      ) : null}

      <h2
        id={titleId}
        className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>

      {description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-strong">{description}</p>
      ) : null}
    </div>
  );
}
