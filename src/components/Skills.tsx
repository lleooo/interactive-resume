import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { resumeData } from '../data/resume-data';
import { SkillCategory } from './SkillCategory';

export function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills" className="bg-slate-50 px-6 py-10 sm:px-10 dark:bg-slate-800/30">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        <span className="h-6 w-1.5 rounded-full bg-linear-to-b from-indigo-500 to-fuchsia-500" />
        {t(uiStrings.skills.heading)}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {resumeData.skills.map((category) => (
          <SkillCategory key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
