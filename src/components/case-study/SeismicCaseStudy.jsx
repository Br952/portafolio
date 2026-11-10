import { useEffect, useRef } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Bot,
  FileSpreadsheet,
  Layers,
  Map,
  MonitorSmartphone,
  Radio,
  Ruler,
  Server,
  Settings2,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import { seismicCaseStudy } from '@/data/caseStudies';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';
import { BentoCell, BentoGrid } from '@/components/ui/BentoGrid';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Reveal } from '@/components/motion/Reveal';

const ICONS = {
  activity: Activity,
  bot: Bot,
  file: FileSpreadsheet,
  layers: Layers,
  map: Map,
  monitor: MonitorSmartphone,
  radio: Radio,
  ruler: Ruler,
  server: Server,
  settings: Settings2,
  waves: Waves,
};

function Icon({ name, className }) {
  const Component = ICONS[name] ?? Layers;

  return <Component className={className} strokeWidth={1.65} aria-hidden="true" />;
}

function CaseSection({ id, testId, kicker, title, intro, children, className }) {
  return (
    <section
      id={id}
      data-testid={testId}
      aria-labelledby={`${id}-title`}
      className={cn('border-t border-ink/[0.06] py-16 sm:py-24', className)}
    >
      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            kicker={kicker}
            title={title}
            titleId={`${id}-title`}
            description={intro}
          />
        </Reveal>

        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

export function SeismicCaseStudy() {
  const study = seismicCaseStudy;
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });

    const { hash } = window.location;
    if (!hash.startsWith('#caso-')) return;

    const target = document.getElementById(hash.slice(1));
    if (target) {
      window.requestAnimationFrame(() =>
        target.scrollIntoView({ block: 'start', behavior: 'auto' }),
      );
    }
  }, []);

  return (
    <article
      id="caso-contenido"
      data-testid="case-study"
      aria-labelledby="case-study-title"
      tabIndex={-1}
      className="relative isolate outline-none"
    >
      {/* ── Hero del caso ─────────────────────────────────── */}
      <header className="relative overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_-10%,rgba(56,189,248,0.13),transparent_70%)]" />
          <div className="dot-grid absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent_75%)]" />
        </div>

        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <a
            href="#proyectos"
            data-testid="case-study-back"
            className="group inline-flex items-center gap-2 rounded-md text-[13px] font-medium text-muted-strong transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-200 ease-expo group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Volver a proyectos
          </a>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {study.kicker}
              </p>

              <h1
                id="case-study-title"
                data-testid="case-study-title"
                ref={titleRef}
                tabIndex={-1}
                className="mt-4 font-display text-[clamp(2rem,5vw,3.35rem)] font-semibold leading-[1.05] tracking-tight text-ink outline-none"
              >
                {study.title}
              </h1>

              <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-muted-strong sm:text-base">
                {study.subtitle}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack del proyecto">
                {study.stack.map((item) => (
                  <li key={item}>
                    <Badge>{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-5">
              {study.meta.map((item) => (
                <div key={item.label} className="border-t border-ink/10 pt-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-strong">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-[13px] font-medium leading-snug text-ink">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="mt-12">
            <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-1.5 shadow-glow sm:p-2">
              <img
                src={asset(study.image.src)}
                alt={study.image.alt}
                width={study.image.width}
                height={study.image.height}
                loading="eager"
                decoding="async"
                data-testid="case-study-hero-image"
                className="h-auto w-full rounded-lg border border-ink/[0.07] object-cover"
              />
            </div>
            <figcaption className="mt-3 flex flex-col gap-1 text-[12px] leading-relaxed text-muted-strong sm:flex-row sm:items-center sm:justify-between">
              <span>{study.image.caption}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-strong/80">
                Captura autorizada · datos internos
              </span>
            </figcaption>
          </figure>

          <nav aria-label="Contenido del caso de estudio" className="mt-10">
            <ol className="flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/[0.06] pt-5">
              {study.toc.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group inline-flex items-baseline gap-1.5 rounded text-[12px] font-medium text-muted-strong transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <span className="font-mono text-[10px] tabular-nums text-accent/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-muted-strong">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            {study.disclaimer}
          </p>
        </div>
      </header>

      {/* ── Problema ─────────────────────────────────────── */}
      <CaseSection
        id="caso-problema"
        testId="case-study-problem"
        kicker={study.problem.kicker}
        title={study.problem.title}
        intro={study.problem.intro}
        className="border-t-0 pt-4 sm:pt-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {study.problem.points.map((point, index) => (
            <Reveal key={point.title} delay={index * 60} className="h-full">
              <SpotlightCard className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-6">
                <span className="font-mono text-[11px] tabular-nums text-accent/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">{point.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </CaseSection>

      {/* ── Rol ──────────────────────────────────────────── */}
      <CaseSection
        id="caso-rol"
        testId="case-study-role"
        kicker={study.role.kicker}
        title={study.role.title}
        intro={study.role.intro}
      >
        <Reveal>
          <GlassPanel className="overflow-hidden">
            <ul className="divide-y divide-ink/[0.07]">
              {study.role.responsibilities.map((item, index) => (
                <li
                  key={item.title}
                  className="grid gap-2 px-5 py-5 sm:grid-cols-[3rem_15rem_1fr] sm:items-baseline sm:gap-5 sm:px-7"
                >
                  <span className="font-mono text-[11px] tabular-nums text-accent/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-strong">{item.body}</p>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </Reveal>
      </CaseSection>

      {/* ── Solución ─────────────────────────────────────── */}
      <CaseSection
        id="caso-solucion"
        testId="case-study-solution"
        kicker={study.solution.kicker}
        title={study.solution.title}
        intro={study.solution.intro}
      >
        <BentoGrid>
          {study.solution.features.map((feature, index) => (
            <BentoCell key={feature.title} className={cn('h-full', feature.span)}>
              <Reveal delay={(index % 3) * 60} className="h-full">
                <SpotlightCard
                  data-testid="case-study-feature"
                  className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-6 transition-colors duration-300 ease-expo hover:border-accent/25"
                >
                  <span className="grid size-10 place-items-center rounded-lg border border-accent/20 bg-accent/[0.08] text-accent">
                    <Icon name={feature.icon} className="size-[18px]" />
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-semibold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-strong">{feature.body}</p>
                </SpotlightCard>
              </Reveal>
            </BentoCell>
          ))}
        </BentoGrid>
      </CaseSection>

      {/* ── Arquitectura ─────────────────────────────────── */}
      <CaseSection
        id="caso-arquitectura"
        testId="case-study-architecture"
        kicker={study.architecture.kicker}
        title={study.architecture.title}
        intro={study.architecture.intro}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {study.architecture.layers.map((layer, index) => (
            <Reveal key={layer.title} delay={index * 70} className="h-full">
              <SpotlightCard className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-canvas-deep/50 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-lg border border-ink/10 bg-ink/[0.03] text-accent">
                    <Icon name={layer.icon} className="size-4" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-strong">
                    {layer.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[17px] font-semibold tracking-tight text-ink">
                  {layer.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">{layer.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-strong">
              Flujo de un evento
            </p>

            <ol className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
              {study.architecture.flow.map((step, index) => (
                <li key={step.title} className="relative">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-full border border-accent/30 bg-accent/[0.08] font-mono text-[10px] tabular-nums text-accent">
                      {index + 1}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
                  </div>
                  <h3 className="mt-2.5 text-[13px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-strong">{step.body}</p>
                </li>
              ))}
            </ol>

            <p className="mt-6 flex items-start gap-2 border-t border-ink/[0.07] pt-4 text-[12px] leading-relaxed text-muted-strong">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
              <span>
                <span className="font-medium text-ink">Resiliencia por diseño. </span>
                {study.architecture.resilience}
              </span>
            </p>
          </div>
        </Reveal>
      </CaseSection>

      {/* ── Decisiones ───────────────────────────────────── */}
      <CaseSection
        id="caso-decisiones"
        testId="case-study-decisions"
        kicker="// decisiones técnicas"
        title="Lo que elegí y lo que costó"
        intro="Cada decisión tiene una razón y un precio. Estas son las cuatro que más definieron el producto."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {study.decisions.map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 70} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-6 sm:p-7">
                <span className="font-mono text-[11px] tabular-nums text-accent/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-ink">
                  {item.title}
                </h3>

                <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80">
                      Decisión
                    </dt>
                    <dd className="mt-1 text-muted-strong">{item.decision}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-success/90">
                      Por qué
                    </dt>
                    <dd className="mt-1 text-muted-strong">{item.why}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-warning/90">
                      Coste asumido
                    </dt>
                    <dd className="mt-1 text-muted-strong">{item.cost}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </CaseSection>

      {/* ── Resultados ───────────────────────────────────── */}
      <CaseSection
        id="caso-resultados"
        testId="case-study-results"
        kicker={study.results.kicker}
        title={study.results.title}
        intro={study.results.intro}
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {study.results.metrics.map((metric, index) => (
            <li key={metric.label} className="h-full">
              <Reveal delay={index * 60} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-5">
                  <p className="font-display text-3xl font-semibold tracking-tight text-success">
                    {metric.value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-strong">
                    {metric.label}
                  </p>
                  <p className="mt-3 border-t border-ink/[0.07] pt-3 text-[12px] leading-relaxed text-muted-strong">
                    {metric.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </CaseSection>

      {/* ── Aprendizajes ─────────────────────────────────── */}
      <CaseSection
        id="caso-aprendizajes"
        testId="case-study-learnings"
        kicker="// aprendizajes"
        title="Lo que me llevo"
        intro="Decisiones que hoy aplicaría en cualquier producto con datos críticos y un operador real al frente."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {study.learnings.map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 60} className="h-full">
              <div className="flex h-full gap-4 rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-6">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-success/25 bg-success/[0.08] text-success">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-strong">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </CaseSection>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="border-t border-ink/[0.06] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <Reveal>
            <GlassPanel className="flex flex-col gap-6 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Siguiente
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                  ¿Conversamos sobre tu producto?
                </h2>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-strong">
                  Este caso combina datos geoespaciales, operación real e IA aplicada. Si tienes un
                  problema parecido, puedo ayudarte a convertirlo en una herramienta clara.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="#proyectos" variant="secondary">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Ver proyectos
                </Button>
                <Button href="#contacto">
                  Hablemos
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
