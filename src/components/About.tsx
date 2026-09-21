import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { resumeData } from '../data/resume-data';

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="px-6 py-10 sm:px-10">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        <span className="h-6 w-1.5 rounded-full bg-linear-to-b from-indigo-500 to-fuchsia-500" />
        {t(uiStrings.about.heading)}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
        {t(resumeData.summary)}
      </p>

      <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
        {t(uiStrings.about.highlightsHeading)}
      </h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {resumeData.highlights.map((highlight, index) => (
          <li
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            {t(highlight)}
          </li>
        ))}
      </ul>
    </section>
  );
}
