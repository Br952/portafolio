import { SkipLink } from '@/components/layout/SkipLink';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stack } from '@/components/sections/Stack';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';

export default function App() {
  return (
    <div className="relative min-h-dvh">
      <SkipLink />
      <Navbar />

      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <Stack />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
