import { useLanguage } from '../i18n/LanguageContext';
import { resumeData } from '../data/resume-data';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function Hero() {
  const { t } = useLanguage();
  const { name, title, tagline, contact } = resumeData;

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 py-8 text-center sm:px-10 sm:py-10"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-br from-indigo-500/10 via-fuchsia-500/10 to-transparent dark:from-indigo-500/20 dark:via-fuchsia-500/10" />

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center sm:gap-8 sm:flex-row sm:items-stretch sm:text-left">
        <div className="flex shrink-0 flex-col items-center sm:items-center">
          <div className="flex h-24 w-24 cursor-default items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 text-2xl font-bold text-white shadow-lg ring-4 ring-white transition-transform duration-300 hover:-rotate-3 hover:scale-105 dark:ring-slate-900">
            {getInitials(t(name))}
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {t(title)}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="mx-auto max-w-2xl  text-slate-600 dark:text-slate-300 sm:mx-0">
            {t(tagline)}
          </div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t(contact.location)}
          </div>
        </div>
      </div>
    </section>
  );
}
