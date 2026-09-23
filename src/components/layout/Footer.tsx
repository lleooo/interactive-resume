import { useLanguage } from '../../i18n/LanguageContext';
import { uiStrings } from '../../i18n/ui-strings';
import { resumeData } from '../../data/resume-data';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-100 px-6 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      © {new Date().getFullYear()} {t(resumeData.name)} — {t(uiStrings.footer.rights)}
    </footer>
  );
}
