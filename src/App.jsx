import { useEffect } from 'react';
import { SkipLink } from '@/components/layout/SkipLink';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stack } from '@/components/sections/Stack';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import { SeismicCaseStudy } from '@/components/case-study/SeismicCaseStudy';
import { useHashRoute, ROUTES } from '@/hooks/useHashRoute';
import { seismicCaseStudy } from '@/data/caseStudies';
import { site } from '@/config/site';

function setMetaContent(selector, content) {
  document.querySelector(selector)?.setAttribute('content', content);
}

export default function App() {
  const route = useHashRoute();
  const isCaseStudy = route === ROUTES.seismic;

  // Metadatos por vista: el HTML inicial los inyecta Vite para la home;
  // al navegar al caso se actualizan sin recargar.
  useEffect(() => {
    const title = isCaseStudy ? seismicCaseStudy.seo.title : site.seo.title;
    const description = isCaseStudy
      ? seismicCaseStudy.seo.description
      : site.seo.description;
    const socialDescription = isCaseStudy
      ? seismicCaseStudy.seo.description
      : site.seo.ogDescription;

    document.title = title;

    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', socialDescription);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', socialDescription);
  }, [isCaseStudy]);

  // Al cambiar de vista, el scroll y el foco deben tener un destino claro.
  // Las anclas internas del caso (#caso-*) las resuelve el propio componente.
  useEffect(() => {
    if (isCaseStudy) {
      if (!window.location.hash.startsWith('#caso-')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      return;
    }

    const { hash } = window.location;
    if (!hash.startsWith('#') || hash.startsWith('#/')) return;

    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
      const heading = target.querySelector('h1, h2');
      (heading ?? target).focus?.({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isCaseStudy]);

  return (
    <div className="relative min-h-dvh">
      <SkipLink href={isCaseStudy ? '#caso-contenido' : '#contenido'} />
      <Navbar key={route} />

      <main id="contenido" tabIndex={-1} className="outline-none">
        {isCaseStudy ? (
          <SeismicCaseStudy />
        ) : (
          <>
            <Hero />
            <Stack />
            <Projects />
            <Contact />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
