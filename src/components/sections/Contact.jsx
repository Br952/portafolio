import { useRef, useState } from 'react';
import { ArrowUpRight, Check, Loader2, Mail, Send } from 'lucide-react';
import { site } from '@/config/site';
import { sendMessage, validateContact } from '@/lib/contact';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatusPill } from '@/components/ui/StatusPill';
import { cn } from '@/lib/cn';

const INITIAL_VALUES = { name: '', email: '', message: '' };
const FIELD_ORDER = ['name', 'email', 'message'];

const inputBase =
  'w-full rounded-lg border bg-canvas-deep/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-strong/55 ' +
  'transition-[border-color,box-shadow] duration-200 ease-expo focus:outline-none focus:ring-2';

function inputClass(hasError) {
  return cn(
    inputBase,
    hasError
      ? 'border-danger/50 focus:border-danger/70 focus:ring-danger/20'
      : 'border-ink/10 hover:border-ink/20 focus:border-accent/50 focus:ring-accent/25',
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-strong"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs leading-relaxed text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [channel, setChannel] = useState(null);
  const refs = useRef({});

  const setFieldRef = (field) => (node) => {
    refs.current[field] = node;
  };

  const handleChange = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);

    if (status === 'success' || status === 'error') {
      setStatus('idle');
      setFeedback('');
      setChannel(null);
    }

    if (touched[field]) setErrors(validateContact(next));
  };

  const handleBlur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateContact(values));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    setFeedback('');

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      refs.current[firstInvalid]?.focus();
      return;
    }

    setStatus('submitting');

    try {
      const result = await sendMessage(values, {
        endpoint: site.contactEndpoint,
        email: site.email,
      });

      setStatus('success');
      setChannel(result.channel);
      setFeedback(
        result.channel === 'mailto'
          ? 'Abrimos tu cliente de correo con el mensaje listo para enviar.'
          : 'Mensaje enviado. Te respondo en menos de 24 horas.',
      );
      setValues(INITIAL_VALUES);
      setTouched({});
    } catch {
      setStatus('error');
      setChannel(null);
      setFeedback(`No pudimos enviar el mensaje. Escríbeme directamente a ${site.email}.`);
    }
  };

  const submitting = status === 'submitting';

  return (
    <form
      noValidate
      data-testid="contact-form"
      data-state={status}
      aria-busy={submitting}
      onSubmit={handleSubmit}
      className="edge-highlight rounded-2xl border border-ink/[0.08] bg-ink/[0.02] p-6 sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-strong">
          // nuevo mensaje
        </p>
        <Badge>
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          Respuesta &lt; 24 h
        </Badge>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Nombre" error={touched.name ? errors.name : undefined}>
          <input
            ref={setFieldRef('name')}
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
            className={inputClass(Boolean(touched.name && errors.name))}
            placeholder="Tu nombre completo"
          />
        </Field>

        <Field id="contact-email" label="Email" error={touched.email ? errors.email : undefined}>
          <input
            ref={setFieldRef('email')}
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
            className={inputClass(Boolean(touched.email && errors.email))}
            placeholder="nombre@empresa.com"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          id="contact-message"
          label="Mensaje"
          error={touched.message ? errors.message : undefined}
        >
          <textarea
            ref={setFieldRef('message')}
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange('message')}
            onBlur={handleBlur('message')}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
            className={cn(inputClass(Boolean(touched.message && errors.message)), 'min-h-32 resize-y')}
            placeholder="Contexto, objetivo y plazo estimado del proyecto…"
          />
        </Field>
      </div>

      <div
        role={status === 'error' ? 'alert' : 'status'}
        aria-live={status === 'error' ? 'assertive' : 'polite'}
        data-testid="contact-feedback"
        className={
          feedback
            ? cn(
                'mt-5 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-relaxed',
                status === 'error'
                  ? 'border-danger/25 bg-danger/[0.07] text-danger'
                  : 'border-success/25 bg-success/[0.07] text-success',
              )
            : 'sr-only'
        }
      >
        {feedback ? (
          <>
            {status === 'error' ? (
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            ) : (
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            )}
            <span>{feedback}</span>
          </>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={submitting} data-testid="contact-submit">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : status === 'success' ? (
            channel === 'mailto' ? (
              <>
                <Mail className="size-4" aria-hidden="true" />
                Revisa tu correo
              </>
            ) : (
              <>
                <Check className="size-4" aria-hidden="true" />
                Mensaje enviado
              </>
            )
          ) : (
            <>
              Enviar mensaje
              <Send
                className="size-4 transition-transform duration-200 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>

        <p className="font-mono text-[10px] leading-relaxed text-muted-strong">
          Sin spam · Sin intermediarios
        </p>
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section
      id="contacto"
      data-testid="contact-section"
      aria-labelledby="contact-title"
      className="relative isolate border-t border-ink/[0.06] py-20 sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 top-0 size-[30rem] rounded-full bg-accent/[0.05] blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-5">
            <SectionHeading
              kicker="// contacto"
              title="Construyamos algo que aguante producción."
              titleId="contact-title"
              description="Cuéntame el problema antes de la solución. Respondo con un diagnóstico honesto: si tu proyecto no necesita lo que ofrezco, te lo digo."
            />

            <div className="mt-8 space-y-4">
              <StatusPill>{site.availability}</StatusPill>

              <a
                href={`mailto:${site.email}`}
                data-testid="contact-email"
                className="group flex items-center gap-3 rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-4 transition-colors duration-300 ease-expo hover:border-accent/25 hover:bg-ink/[0.03]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-accent/20 bg-accent/[0.08] text-accent">
                  <Mail className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-strong">
                    Email directo
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[13px] text-ink transition-colors duration-200 group-hover:text-accent">
                    {site.email}
                  </span>
                </span>

                <ArrowUpRight
                  className="ml-auto size-4 shrink-0 text-muted-strong transition-transform duration-200 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <div className="flex flex-wrap gap-2">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-ink/[0.02] px-3 py-2 text-[12px] font-medium text-muted-strong transition-colors duration-200 hover:border-accent/30 hover:text-ink"
                  >
                    {social.label}
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-200 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>

              <p className="flex items-center gap-2 font-mono text-[11px] text-muted-strong">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                {site.location} · respuesta &lt; 24 h
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
