import { useLanguage } from '../i18n/LanguageContext';
import type { SkillCategory as SkillCategoryType } from '../data/resume-data';

export function SkillCategory({ category }: { category: SkillCategoryType }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        {t(category.categoryLabel)}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition duration-200 hover:scale-110 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
