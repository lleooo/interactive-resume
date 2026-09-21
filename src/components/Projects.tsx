import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { resumeData } from '../data/resume-data';
import { ProjectCard } from './ProjectCard';

const allTags = Array.from(new Set(resumeData.projects.flatMap((project) => project.tech))).sort();

export function Projects() {
  const { t } = useLanguage();
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const sortedProjects = [...resumeData.projects].sort(
    (a, b) => Number(Boolean(b.highlight)) - Number(Boolean(a.highlight)),
  );
  const visibleProjects =
    activeTags.length === 0
      ? sortedProjects
      : sortedProjects.filter((project) => project.tech.some((tech) => activeTags.includes(tech)));

  return (
    <section id="projects" className="px-6 py-10 sm:px-10">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        <span className="h-6 w-1.5 rounded-full bg-linear-to-b from-indigo-500 to-fuchsia-500" />
        {t(uiStrings.projects.heading)}
      </h2>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTags([])}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            activeTags.length === 0
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200'
          }`}
        >
          {t(uiStrings.projects.allTags)}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeTags.includes(tag)
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {visibleProjects.length === 0 ? (
          <p className="col-span-full text-center text-sm text-slate-500 dark:text-slate-400">
            {t(uiStrings.projects.noResults)}
          </p>
        ) : (
          visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} activeTags={activeTags} onToggleTag={toggleTag} />
          ))
        )}
      </div>
    </section>
  );
}
