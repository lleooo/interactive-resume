import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import type { ProjectEntry } from '../data/resume-data';

interface ProjectCardProps {
  project: ProjectEntry;
  activeTags: string[];
  onToggleTag: (tech: string) => void;
}

export function ProjectCard({ project, activeTags, onToggleTag }: ProjectCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        project.highlight
          ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-700 dark:bg-indigo-950/30'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t(project.title)}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(project.role)}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((tech) => {
          const isActive = activeTags.includes(tech);
          return (
            <button
              key={tech}
              type="button"
              onClick={() => onToggleTag(tech)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-200'
              }`}
            >
              {tech}
            </button>
          );
        })}
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">{t(uiStrings.projects.challenge)}</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300">{t(project.challenge)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">{t(uiStrings.projects.solution)}</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300">{t(project.solution)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">{t(uiStrings.projects.outcome)}</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300">{t(project.outcome)}</dd>
        </div>
      </dl>
    </div>
  );
}
