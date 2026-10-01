import { useLanguage } from '../../../shared/i18n/LanguageContext';
import { uiStrings } from '../../../shared/i18n/ui-strings';
import { resumeData } from '../../../shared/data/resume-data';

interface LandingOverlayProps {
  onOpenResume: () => void;
}

export function LandingOverlay({ onOpenResume }: LandingOverlayProps) {
  const { t } = useLanguage();
  const { name, title, contact } = resumeData;
  const strings = uiStrings.landing;
  const contactStrings = uiStrings.contact;

  return (
    <>
      {/* Desktop: name and title on either side of the character. */}
      <div className="hidden md:contents">
        <div className=" pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6 md:px-40 lg:px-60">
          <div className="pointer-events-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {t(strings.greeting)}
            </p>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-6xl dark:text-white">
              {t(name)}
            </h1>
          </div>
          <div className="pointer-events-auto text-right">
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
              {t(title)}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto absolute bottom-6 left-6 flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {t(contactStrings.email)}
          </a>
        </div>

        <button
          type="button"
          onClick={onOpenResume}
          className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-500/30"
        >
          {t(strings.resumeCta)}
        </button>
      </div>

      {/* Mobile: full-body character with the text stacked over its lower
          half, bottom-left, and a copyright line at the very bottom. */}
      <div className="md:hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-20 px-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {t(title)}
          </p>
          <h1 className="mt-4 text-6xl font-bold leading-none text-slate-900 dark:text-white">
            {t(name)
              .split(' ')
              .map((part) => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
          </h1>
          <button
            type="button"
            onClick={onOpenResume}
            className="pointer-events-auto mt-8 rounded-full border border-slate-900/20 bg-slate-900/5 px-12 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 backdrop-blur dark:border-white/25 dark:bg-white/5 dark:text-white"
          >
            {t(strings.resumeCta)}
          </button>
        </div>
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs tracking-widest text-slate-500 dark:text-slate-400">
          Copyright © {new Date().getFullYear()} {t(name)}
        </p>
      </div>
    </>
  );
}
