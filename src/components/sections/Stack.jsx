import { Database, Gauge, Layers, Map, ShieldCheck } from 'lucide-react';
import { skillGroups } from '@/data/skills';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

const ICONS = {
  layers: Layers,
  database: Database,
  map: Map,
  shield: ShieldCheck,
  gauge: Gauge,
};

function SkillCard({ group, index }) {
  const Icon = ICONS[group.icon] ?? Layers;

  return (
    <SpotlightCard
      data-testid="skill-card"
      className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-6 transition-colors duration-300 ease-expo hover:border-accent/25 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-lg border border-accent/20 bg-accent/[0.08] text-accent">
          <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="font-mono text-[11px] tabular-nums text-muted-strong">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">
        {group.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-strong">{group.description}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-ink/[0.07] bg-ink/[0.02] px-2.5 py-1 font-mono text-[11px] text-muted-strong"
          >
            {item}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}

export function Stack() {
  return (
    <section
      id="stack"
      data-testid="stack-section"
      aria-labelledby="stack-title"
      className="relative isolate border-t border-ink/[0.06] py-20 sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 size-[26rem] rounded-full bg-accent/[0.04] blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
        <SectionHeading
          kicker="// stack"
          title="Herramientas con las que construyo"
          titleId="stack-title"
          description="Cuatro disciplinas que trabajan juntas: una interfaz rápida sin un backend sólido es solo una demo."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12">
          {skillGroups.map((group, index) => (
            <div key={group.id} className={group.span}>
              <SkillCard group={group} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
