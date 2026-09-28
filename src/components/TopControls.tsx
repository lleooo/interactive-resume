import { useMediaQuery } from '../chatbot/model/useMediaQuery';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { useTheme } from '../theme/ThemeContext';
import { EASE } from './ResumePanel';

interface TopControlsProps {
  /** Shows the close button when the resume panel is open. */
  resumeOpen: boolean;
  onClose: () => void;
}

const controlClass =
  'flex h-9 items-center justify-center rounded-full border border-white/20 bg-white/80 text-sm font-semibold text-slate-700 shadow backdrop-blur hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-900/80 dark:text-slate-200';

export function TopControls({ resumeOpen, onClose }: TopControlsProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const closeFade = `${reducedMotion ? '' : `transition-opacity ${EASE}`} ${resumeOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`;

  return (
    <div className="fixed right-3 top-3 z-40 flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        className={`${controlClass} w-9`}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <button
        type="button"
        onClick={toggleLang}
        className={`${controlClass} px-3 text-xs`}
        aria-label="Toggle language"
      >
        {lang === 'en' ? 'EN | 中' : '中 | EN'}
      </button>
      {/* Kept in the layout while hidden so the other buttons never shift. */}
      <button
        type="button"
        onClick={onClose}
        className={`${controlClass} w-9 ${closeFade}`}
        aria-label={t(uiStrings.landing.close)}
        inert={!resumeOpen}
        aria-hidden={!resumeOpen}
      >
        ✕
      </button>
    </div>
  );
}
