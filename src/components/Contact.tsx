import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { resumeData } from '../data/resume-data';

export function Contact() {
  const { t } = useLanguage();
  const { contact } = resumeData;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable or permission denied
    }
  };

  return (
    <section id="contact" className="px-6 py-12 text-center sm:px-10">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        {t(uiStrings.contact.heading)}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">
        {t(uiStrings.contact.subheading)}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <a
            href={`mailto:${contact.email}`}
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {t(uiStrings.contact.email)}: {contact.email}
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-sm hover:border-indigo-400 dark:border-slate-600"
            aria-label={copied ? t(uiStrings.contact.copied) : t(uiStrings.contact.copyEmail)}
            title={copied ? t(uiStrings.contact.copied) : t(uiStrings.contact.copyEmail)}
          >
            {copied ? '✅' : '📋'}
          </button>
        </div>

        <a
          href={contact.github ?? '#'}
          target={contact.github ? '_blank' : undefined}
          rel={contact.github ? 'noreferrer' : undefined}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-200"
        >
          {t(uiStrings.contact.github)}
          {!contact.github && <span className="ml-1 text-xs text-slate-400">({t(uiStrings.contact.comingSoon)})</span>}
        </a>

        <a
          href={contact.linkedin ?? '#'}
          target={contact.linkedin ? '_blank' : undefined}
          rel={contact.linkedin ? 'noreferrer' : undefined}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-200"
        >
          {t(uiStrings.contact.linkedin)}
          {!contact.linkedin && (
            <span className="ml-1 text-xs text-slate-400">({t(uiStrings.contact.comingSoon)})</span>
          )}
        </a>
      </div>
    </section>
  );
}
