import { ArrowUpRight } from 'lucide-react';
import { site } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-ink/[0.06]">
      <div className="mx-auto flex w-full max-w-[76rem] flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-sm font-semibold tracking-tight text-ink">
            {site.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted-strong">
            {site.role} · {site.location}
          </p>
        </div>

        <nav aria-label="Enlaces de contacto" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-1 text-[12px] font-medium text-muted-strong transition-colors duration-200 hover:text-ink"
            >
              {social.label}
              <ArrowUpRight
                className="size-3 transition-transform duration-200 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          ))}

          <a
            href={`mailto:${site.email}`}
            className="font-mono text-[11px] text-muted-strong transition-colors duration-200 hover:text-accent"
          >
            {site.email}
          </a>
        </nav>

        <p className="font-mono text-[11px] text-muted-strong">
          © {new Date().getFullYear()} · React · Vite · Tailwind · Playwright
        </p>
      </div>
    </footer>
  );
}
