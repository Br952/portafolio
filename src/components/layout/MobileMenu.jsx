import { useEffect, useRef } from 'react';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { navItems } from '@/data/nav';
import { site } from '@/config/site';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/lib/cn';

/**
 * Panel de navegación móvil. Se mantiene montado para poder animar
 * la salida; `inert` lo saca del árbol de foco cuando está cerrado.
 * Incluye focus trap, cierre con Escape y devolución del foco al trigger.
 */
export function MobileMenu({ open, onClose, activeId }) {
  const panelRef = useRef(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previous = document.activeElement;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll('a[href], button:not([disabled])')).filter(
        (element) => element.getClientRects().length > 0,
      );

    getFocusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div id="mobile-menu" className="lg:hidden">
      <div
        aria-hidden="true"
        data-open={open}
        onClick={onClose}
        className={cn(
          'fixed inset-0 top-16 z-40 bg-canvas/85 backdrop-blur-md transition-opacity duration-300 ease-out',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        data-testid="mobile-menu"
        data-open={open}
        inert={!open}
        className={cn(
          'fixed inset-x-0 top-16 z-40 origin-top border-b border-ink/[0.07] bg-canvas/95 px-5 pb-6 pt-2 backdrop-blur-2xl',
          'transition-[opacity,transform] duration-300 ease-expo',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <nav aria-label="Navegación móvil">
          <ul className="flex flex-col">
            {navItems.map((item, index) => {
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={onClose}
                    data-testid={`mobile-nav-link-${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200',
                      isActive ? 'text-ink' : 'text-muted-strong hover:text-ink',
                    )}
                  >
                    <span className="font-mono text-[11px] text-muted-strong">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-display text-[17px] font-medium tracking-tight">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-1.5 rounded-full bg-accent transition-opacity duration-200',
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-3 grid gap-2 border-t border-ink/[0.07] pt-4">
          <a
            href={site.resume}
            download
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-accent/30"
          >
            <Download className="size-4 text-muted-strong" aria-hidden="true" />
            Descargar CV
            <ArrowUpRight className="ml-auto size-3.5 text-muted" aria-hidden="true" />
          </a>

          <a
            href={`mailto:${site.email}`}
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-[12px] text-muted-strong transition-colors duration-200 hover:text-ink"
          >
            <Mail className="size-4" aria-hidden="true" />
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
