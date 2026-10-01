import { useLanguage } from '../../../shared/i18n/LanguageContext';
import { uiStrings } from '../../../shared/i18n/ui-strings';
import { resumeData } from '../../../shared/data/resume-data';
import { HeadshotZoom } from './HeadshotZoom';

export function Hero() {
  const { t } = useLanguage();
  const { name, title, tagline, contact } = resumeData;

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 py-8 text-center sm:px-10 sm:py-10"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center sm:gap-8 sm:flex-row sm:items-stretch sm:text-left">
        <div className="flex shrink-0 flex-col items-center sm:items-center">
          <HeadshotZoom alt={t(name)} label={t(uiStrings.hero.enlargePhoto)} />

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {t(title)}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="mx-auto max-w-2xl  text-slate-600 dark:text-slate-300 sm:mx-0">
            {t(tagline)}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-slate-500 sm:justify-start dark:text-slate-400">
            <span>📍 {t(contact.location)}</span>
            <span aria-hidden="true">·</span>
            <a
              href={`mailto:${contact.email}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              ✉️ {contact.email}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`tel:${contact.phone.tel}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              📱 {t(contact.phone.display)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
