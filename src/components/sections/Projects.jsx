import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { asset } from '@/lib/asset';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

/**
 * Preview del proyecto destacado. Si hay captura real se muestra la imagen;
 * si aún no existe, cae a un mock dibujado con divs (cero imágenes, cero CLS)
 * en lugar de dejar un hueco roto.
 */
function ProjectPreview({ project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(project.image) && !imageFailed;
  const bars = [34, 58, 44, 72, 52, 84, 66];

  return (
    <div
      data-testid="project-preview"
      aria-hidden={showImage ? undefined : 'true'}
      className="mb-6 flex min-h-[230px] flex-1 flex-col overflow-hidden rounded-lg border border-ink/[0.07] bg-canvas-deep/80"
    >
      {showImage ? (
        <img
          src={asset(project.image)}
          alt={project.imageAlt ?? ''}
          width={1280}
          height={709}
          loading="lazy"
          decoding="async"
          data-testid="project-preview-image"
          onError={() => setImageFailed(true)}
          className="h-full w-full flex-1 object-cover object-center"
        />
      ) : (
        <>
          <div className="flex items-center gap-1.5 border-b border-ink/[0.06] px-3 py-2">
            <span className="size-1.5 rounded-full bg-danger/60" />
            <span className="size-1.5 rounded-full bg-warning/60" />
            <span className="size-1.5 rounded-full bg-success/60" />
            <span className="ml-2 truncate font-mono text-[10px] text-muted-strong/85">
              funvisis.gob.ve
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="rounded border border-ink/[0.06] bg-ink/[0.03] p-2">
                <span className="block h-1 w-8 rounded-full bg-ink/15" />
                <span className="mt-2 block h-2 w-10 rounded-full bg-ink/25" />
              </div>
            ))}
          </div>

          <div className="flex min-h-20 flex-1 items-end gap-1.5 px-3 pb-3">
            {bars.map((height, index) => (
              <span
                key={index}
                style={{ height: `${height}%` }}
                className="flex-1 rounded-sm bg-gradient-to-t from-accent/10 to-accent/45"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <SpotlightCard
      data-testid="project-card"
      as="article"
      className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-6 transition-colors duration-300 ease-expo hover:border-accent/25 sm:p-7"
    >
      {featured ? <ProjectPreview project={project} /> : null}

      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] tabular-nums text-muted-strong">
          {project.index}
        </span>
        <Badge className="shrink-0">{project.tags[0]}</Badge>
      </div>

      <h3
        className={
          featured
            ? 'mt-5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]'
            : 'mt-5 font-display text-xl font-semibold tracking-tight text-ink'
        }
      >
        {project.title}
      </h3>

      <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-muted-strong">
        {project.summary}
      </p>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <div>
          <span className="block font-display text-xl font-semibold tracking-tight text-success">
            {project.metric.value}
          </span>
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-strong">
            {project.metric.label}
          </span>
        </div>

        {project.href ? (
          <a
            href={project.href}
            data-testid="project-link"
            {...(project.href.startsWith('http')
              ? { target: '_blank', rel: 'noreferrer noopener' }
              : {})}
            className="group/link inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium text-accent/90 transition-colors duration-200 hover:text-accent focus-visible:outline-2"
          >
            {project.hrefLabel}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-200 ease-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ) : null}
      </div>
    </SpotlightCard>
  );
}

export function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section
      id="proyectos"
      data-testid="projects-section"
      aria-labelledby="projects-title"
      className="relative isolate border-t border-ink/[0.06] py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="// proyectos"
            title="Trabajo seleccionado"
            titleId="projects-title"
            description="Trabajo real, no maquetas. Cada tarjeta resume el problema, la decisión técnica y el impacto medido."
          />

          <p className="shrink-0 font-mono text-[11px] text-muted-strong">
            <span className="text-success">●</span> 3 casos · trabajo real
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProjectCard project={featured} featured />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {rest.map((project) => (
              <div key={project.id} className="flex-1">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
