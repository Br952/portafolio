import { Check, FileCode2, Terminal } from 'lucide-react';

/**
 * Mockup de IDE (estilo VS Code) construido con HTML/CSS puro.
 * Es decorativo: el contenido visual queda oculto a lectores de pantalla
 * y se ofrece una descripción en el <figcaption>.
 */

const TOKEN_STYLES = {
  kw: 'text-accent',
  str: 'text-success',
  fn: 'text-ink',
  tag: 'text-accent/85',
  attr: 'text-muted-strong',
  prop: 'text-muted-strong',
  punc: 'text-muted-strong/85',
};

const CODE_LINES = [
  [
    ['const ', 'kw'],
    ['engineer', 'fn'],
    [' = {', 'punc'],
  ],
  [
    ['  name: ', 'prop'],
    ["'Brayan Rondón'", 'str'],
    [',', 'punc'],
  ],
  [
    ['  role: ', 'prop'],
    ["'Full Stack'", 'str'],
    [',', 'punc'],
  ],
  [
    ['  stack: ', 'prop'],
    ['[', 'punc'],
    ["'React'", 'str'],
    [', ', 'punc'],
    ["'Python'", 'str'],
    [']', 'punc'],
    [',', 'punc'],
  ],
  [
    ['  focus: ', 'prop'],
    ["'data-viz'", 'str'],
    [',', 'punc'],
  ],
  [['};', 'punc']],
  [],
  [
    ['export default ', 'kw'],
    ['function ', 'kw'],
    ['Hero', 'fn'],
    ['() {', 'punc'],
  ],
  [
    ['  return ', 'kw'],
    ['<', 'punc'],
    ['Impact', 'tag'],
    [' lcp=', 'attr'],
    ['"1.9s"', 'str'],
    [' />', 'punc'],
  ],
  [['}', 'punc']],
];

export function CodeWindow() {
  return (
    <figure className="relative" data-testid="code-window">
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-[1.75rem] bg-accent/[0.06] blur-2xl"
      />

      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-xl border border-ink/10 bg-canvas-deep shadow-glow"
      >
        {/* Barra de ventana */}
        <div className="flex items-center gap-2 border-b border-ink/[0.06] bg-ink/[0.02] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-danger/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
          </div>

          <div className="ml-2 flex min-w-0 items-center gap-1.5 font-mono text-[11px] text-muted-strong">
            <FileCode2 className="size-3.5 shrink-0 text-accent/80" />
            <span className="truncate">hero.jsx</span>
          </div>

          <span className="ml-auto rounded border border-ink/10 px-1.5 py-px font-mono text-[10px] text-muted-strong">
            main
          </span>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-ink/[0.06] font-mono text-[11px]">
          <span className="flex items-center gap-1.5 border-r border-t-2 border-ink/[0.06] border-t-accent bg-ink/[0.03] px-3 py-2 text-ink">
            hero.jsx
          </span>
          <span className="flex items-center gap-1.5 border-r border-ink/[0.06] px-3 py-2 text-muted-strong">
            hero.spec.js
          </span>
        </div>

        {/* Código con números de línea */}
        <div className="grid grid-cols-[2.5rem_1fr]">
          <div className="select-none border-r border-ink/[0.05] py-4 pr-2.5 text-right font-mono text-[11.5px] leading-7 text-muted-strong/85">
            {CODE_LINES.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>

          <div className="min-w-0 py-4 pl-3.5">
            <pre className="overflow-x-auto font-mono text-[11.5px] leading-7 text-ink/85">
              <code>
                {CODE_LINES.map((line, index) => (
                  <div key={index} className="whitespace-pre">
                    {line.length === 0
                      ? '\u00A0'
                      : line.map(([text, type], tokenIndex) => (
                          <span key={tokenIndex} className={TOKEN_STYLES[type]}>
                            {text}
                          </span>
                        ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* Terminal de pruebas */}
        <div className="border-t border-ink/[0.06] bg-ink/[0.015] px-3.5 py-3 font-mono text-[10.5px]">
          <div className="flex items-center gap-2 text-muted-strong">
            <Terminal className="size-3 shrink-0" />
            <span className="truncate">npx playwright test</span>
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <Check className="size-3 shrink-0 text-success" />
            <span className="text-success">suite e2e</span>
            <span className="text-muted-strong/85">(todo verde)</span>
            <span className="ml-auto rounded border border-success/20 bg-success/10 px-1.5 py-px text-[9px] uppercase tracking-[0.14em] text-success">
              CI
            </span>
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        Demostración visual de un editor de código con un componente React y una terminal que muestra
        la suite E2E en verde.
      </figcaption>
    </figure>
  );
}
