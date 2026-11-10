import { cn } from '@/lib/cn';

const VARIANTS = {
  primary:
    'bg-accent text-accent-ink shadow-[0_14px_36px_-16px_rgba(56,189,248,0.7)] hover:bg-[#7dd3fc] hover:shadow-[0_18px_44px_-14px_rgba(56,189,248,0.55)]',
  secondary: 'glass text-ink hover:border-accent/35 hover:bg-ink/[0.07]',
  ghost: 'text-muted-strong hover:bg-ink/[0.04] hover:text-ink',
};

const SIZES = {
  sm: 'h-9 gap-1.5 px-3.5 text-[13px]',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2.5 px-6 text-[15px]',
};

/**
 * Botón/enlace polimórfico. Mantiene un único lenguaje de foco,
 * presión y transición para todos los CTA del sitio.
 */
export function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  type,
  ...props
}) {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      type={href ? undefined : (type ?? 'button')}
      className={cn(
        'group inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-medium',
        'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-expo',
        'active:scale-[0.985] motion-reduce:active:scale-100',
        'disabled:pointer-events-none disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
