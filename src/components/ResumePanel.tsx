import { useMediaQuery } from '../chatbot/model/useMediaQuery';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { Hero } from './Hero';
import { About } from './About';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { Contact } from './Contact';

interface ResumePanelProps {
  open: boolean;
  onClose: () => void;
}

export function ResumePanel({ open, onClose }: ResumePanelProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div
      className={`fixed inset-0 z-30 overflow-y-auto bg-slate-50 dark:bg-slate-950 ${
        reducedMotion ? '' : 'transition-transform duration-500 ease-out'
      } ${open ? 'translate-y-0' : 'translate-y-full'}`}
      inert={!open}
      aria-hidden={!open}
    >
      <Header onBack={onClose} />
      <main className="mx-auto max-w-[794px] px-4 py-8 sm:px-6 sm:py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <Hero />
          <Experience />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
