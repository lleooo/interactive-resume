import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { resumeData } from '../data/resume-data';
import { ExperienceCard } from './ExperienceCard';

export function Experience() {
  const { t } = useLanguage();

  return (
    <section id="experience" className=" px-6  sm:px-10 dark:bg-slate-800/30">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        <span className="h-6 w-1.5 rounded-full bg-linear-to-b from-indigo-500 to-fuchsia-500" />
        {t(uiStrings.experience.heading)}
      </h2>
      <div className="mt-8 space-y-8 border-l-2 border-indigo-200 pl-6 dark:border-indigo-900">
        {resumeData.experience.map((entry) => (
          <ExperienceCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
