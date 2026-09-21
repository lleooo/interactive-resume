import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import type { ExperienceEntry } from '../data/resume-data';

function formatDate(iso: string) {
  const [year, month] = iso.split('-');
  return `${year}/${month}`;
}

export function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const { t } = useLanguage();
  const endLabel = entry.endDate === 'present' ? t(uiStrings.experience.present) : formatDate(entry.endDate);

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <span className="absolute top-6 -left-7.25 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-slate-50 dark:ring-slate-800/30" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t(entry.company)}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t(entry.role)} · {t(entry.location)}
          </p>
        </div>
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {formatDate(entry.startDate)} – {endLabel}
        </span>
      </div>

      {entry.projectName && (
        <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{t(entry.projectName)}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
          >
            {tech}
          </span>
        ))}
      </div>

      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {entry.bullets.map((bullet, index) => (
          <li key={index}>{t(bullet)}</li>
        ))}
      </ul>
    </div>
  );
}
