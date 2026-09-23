import { useEffect, useRef, type MouseEvent } from 'react';
import { useMediaQuery } from '../chatbot/model/useMediaQuery';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { useTheme } from '../theme/ThemeContext';
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

const EASE = 'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';

const controlClass =
  'flex h-9 items-center justify-center rounded-full border border-white/20 bg-white/80 text-sm font-semibold text-slate-700 shadow backdrop-blur hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-900/80 dark:text-slate-200';

export function ResumePanel({ open, onClose }: ResumePanelProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

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
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${fade}`} />

      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto" onClick={closeOnSelf}>
        <main
          className="mx-auto max-w-[794px] px-3 pb-8 pt-14 sm:px-6 sm:py-12"
          onClick={closeOnSelf}
        >
          <article
            className={`overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 ${
              reducedMotion ? '' : `transition-transform ${EASE}`
            } ${open ? 'translate-y-0' : 'translate-y-[100vh]'}`}
          >
            <Hero />
            <Experience />
            <About />
            <Projects />
            <Skills />
            <Contact />
            <Footer />
          </article>
        </main>
      </div>

      <div className={`fixed right-3 top-3 z-40 flex items-center gap-2 ${fade}`}>
        <button type="button" onClick={toggleTheme} className={`${controlClass} w-9`} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button type="button" onClick={toggleLang} className={`${controlClass} px-3 text-xs`} aria-label="Toggle language">
          {lang === 'en' ? 'EN | 中' : '中 | EN'}
        </button>
        <button type="button" onClick={onClose} className={`${controlClass} w-9`} aria-label={t(uiStrings.landing.close)}>
          ✕
        </button>
      </div>
    </div>
  );
}
