import { ArrowRight, Download } from 'lucide-react';
import { site, stack } from '@/config/site';
import { heroMetrics } from '@/data/metrics';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { CodeWindow } from '@/components/ui/CodeWindow';

export function Hero() {
  return (
    <section
      id="inicio"
      data-testid="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Capas de fondo: glow radial + retícula enmascarada. Nunca compiten con el texto. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(56,189,248,0.14),transparent_70%)]" />
        <div className="dot-grid absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_75%)]" />
        <div className="absolute left-1/2 top-0 h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[110px]" />
      </div>

      <div className="mx-auto flex min-h-[100svh] w-full max-w-[76rem] flex-col justify-center px-5 pb-14 pt-28 sm:px-8 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <StatusPill>{site.availability}</StatusPill>

            <h1
              id="hero-title"
              data-testid="hero-title"
              className="mt-6 font-display text-[clamp(2.4rem,6.1vw,4.1rem)] font-bold leading-[1.03] tracking-[-0.035em] text-ink"
            >
              {site.headline.lead}{' '}
              <span className="text-gradient">{site.headline.accent}</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.7] text-muted-strong sm:text-base">
              {site.tagline}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#proyectos" size="lg" data-testid="hero-cta-projects">
                Ver proyectos
                <ArrowRight
                  className="size-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>

              <Button
                href={site.resume}
                download
                variant="secondary"
                size="lg"
                data-testid="hero-cta-cv"
              >
                <Download className="size-4 text-muted-strong" aria-hidden="true" />
                Descargar CV
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-strong">
                stack
              </span>
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-ink/[0.07] bg-ink/[0.02] px-2.5 py-1 font-mono text-[11px] text-muted-strong transition-colors duration-200 hover:border-accent/30 hover:text-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="animate-rise [animation-delay:120ms]">
              <CodeWindow />
            </div>
          </div>
        </div>

        {/* Franja Bento de métricas: datos defendibles, no vanity metrics. */}
        <dl className="mt-14 grid grid-cols-1 divide-y divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/[0.07] bg-ink/[0.02] sm:mt-16 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {heroMetrics.map((metric) => (
            <div
              key={metric.label}
              className="px-5 py-5 transition-colors duration-200 hover:bg-ink/[0.03] sm:px-6"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-strong">
                {metric.label}
              </dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-display text-[26px] font-semibold leading-none tracking-tight text-ink">
                  {metric.value}
                </span>
                <span className="font-display text-sm font-semibold leading-none text-accent">
                  {metric.suffix}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-strong/85">
                  {metric.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
