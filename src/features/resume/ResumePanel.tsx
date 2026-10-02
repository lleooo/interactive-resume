import { useEffect, useRef, type MouseEvent } from 'react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { EASE } from '../../shared/motion';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { ResumeNav } from './components/ResumeNav';
import { Skills } from './components/Skills';

interface ResumePanelProps {
  open: boolean;
  closeOnEscape: boolean;
  onClose: () => void;
}

export function ResumePanel({ open, closeOnEscape, onClose }: ResumePanelProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Only clicks on empty space (not bubbled up from the card) close the panel.
  const closeOnSelf = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fade = `${reducedMotion ? '' : `transition-opacity ${EASE}`} ${open ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div
      className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}
      inert={!open}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${fade}`}
      />

      <div
        ref={scrollRef}
        // Slide the viewport-sized scroller rather than the card, so 100vh always
        // clears the screen no matter how far the resume is scrolled.
        className={`absolute inset-0 overflow-y-auto ${
          reducedMotion ? '' : `transition-transform ${EASE}`
        } ${open ? 'translate-y-0' : 'translate-y-[100vh]'}`}
        onClick={closeOnSelf}
      >
        {/* Sticky inside the scroller (not fixed over it) so it never covers
            the scrollbar. The top padding leaves room for TopControls, which
            float above it, so the blur reads as one header. Not a close
            target: the links sit right next to the empty space. */}
        <header
          className={`sticky top-0 z-10 border-b border-slate-900/5 bg-white/70 pt-14 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/70 ${fade}`}
        >
          <ResumeNav scrollRef={scrollRef} />
        </header>

        <main
          className="mx-auto max-w-[794px] px-3 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-8"
          onClick={closeOnSelf}
        >
          {/* Keep jumped-to section headings clear of the sticky header. */}
          <article className="overflow-hidden [&>section]:scroll-mt-28 rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <Hero />
            <Experience />
            <Projects />
            <Skills />
            <Footer />
          </article>
        </main>
      </div>
    </div>
  );
}
