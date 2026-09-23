import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { resumeData } from '../data/resume-data';

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
      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6 sm:px-16">
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
        <a
          href={contact.github ?? '#'}
          target={contact.github ? '_blank' : undefined}
          rel={contact.github ? 'noreferrer' : undefined}
          className="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {t(contactStrings.github)}
          {!contact.github && (
            <span className="ml-1 text-xs text-slate-400">
              ({t(contactStrings.comingSoon)})
            </span>
          )}
        </a>
        <a
          href={contact.linkedin ?? '#'}
          target={contact.linkedin ? '_blank' : undefined}
          rel={contact.linkedin ? 'noreferrer' : undefined}
          className="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {t(contactStrings.linkedin)}
          {!contact.linkedin && (
            <span className="ml-1 text-xs text-slate-400">
              ({t(contactStrings.comingSoon)})
            </span>
          )}
        </a>
      </div>

      <button
        type="button"
        onClick={onOpenResume}
        className="pointer-events-auto absolute bottom-6 right-6 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-500/30"
      >
        {t(strings.resumeCta)}
      </button>
    </>
  );
}
