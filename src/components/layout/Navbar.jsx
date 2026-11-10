import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { navItems } from '@/data/nav';
import { site } from '@/config/site';
import { asset } from '@/lib/asset';
import { useScrolled } from '@/hooks/useScrolled';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from './MobileMenu';

const NAV_IDS = navItems.map((item) => item.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const scrolled = useScrolled();
  const progress = useScrollProgress();
  const activeId = useScrollSpy(NAV_IDS);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const closeMenu = useCallback(() => setOpen(false), []);

  // Si el viewport crece a desktop con el panel abierto, se cierra solo.
  useEffect(() => {
    if (isDesktop && open) setOpen(false);
  }, [isDesktop, open]);

  return (
    <>
      <header
        data-testid="navbar"
        data-scrolled={scrolled}
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-expo',
          scrolled
            ? 'border-ink/[0.07] bg-canvas/80 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[76rem] items-center gap-3 px-5 sm:px-8">
          <a
            href="#inicio"
            data-testid="nav-logo"
            aria-label={`${site.name} — inicio`}
            onClick={closeMenu}
            className="group flex items-center gap-2.5 rounded-lg py-1"
          >
            <img
              src={asset('/brand/mark-light.png')}
              alt=""
              width="45"
              height="28"
              className="h-7 w-auto transition-opacity duration-200 ease-expo group-hover:opacity-85"
            />
            <span className="hidden font-display text-sm font-semibold tracking-tight text-ink sm:block">
              {site.name}
              <span className="text-accent">.</span>
            </span>
          </a>

          <nav aria-label="Navegación principal" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1" data-testid="nav-links">
              {navItems.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      data-testid={`nav-link-${item.id}`}
                      data-active={isActive}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative block rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-200',
                        isActive ? 'text-ink' : 'text-muted-strong hover:text-ink',
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'pointer-events-none absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-300',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <span className="hidden sm:block">
              <Button href={site.resume} download variant="ghost" size="sm">
                <Download className="size-3.5" aria-hidden="true" />
                CV
              </Button>
            </span>

            <Button href="#contacto" size="sm" data-testid="nav-cta" onClick={closeMenu}>
              Hablemos
            </Button>

            <button
              ref={triggerRef}
              type="button"
              data-testid="nav-menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-lg border border-ink/10 bg-ink/[0.03] text-muted-strong transition-colors duration-200 hover:border-ink/20 hover:text-ink lg:hidden"
            >
              {open ? (
                <X className="size-[18px]" aria-hidden="true" />
              ) : (
                <Menu className="size-[18px]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Progreso de lectura: 1px, compositor-only, sin reflow. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ink/[0.05]">
          <div
            className="h-px origin-left bg-gradient-to-r from-transparent via-accent/70 to-transparent"
            style={{ transform: `scaleX(${Math.max(progress, 0.001)})` }}
          />
        </div>
      </header>

      <MobileMenu open={open} onClose={closeMenu} activeId={activeId} />
    </>
  );
}
