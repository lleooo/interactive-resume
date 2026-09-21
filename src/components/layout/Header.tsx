import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { uiStrings } from '../../i18n/ui-strings';
import { resumeData } from '../../data/resume-data';
import { useTheme } from '../../theme/ThemeContext';

const navItems = [
  { href: '#about', label: uiStrings.nav.about },
  { href: '#experience', label: uiStrings.nav.experience },
  { href: '#projects', label: uiStrings.nav.projects },
  { href: '#skills', label: uiStrings.nav.skills },
  { href: '#contact', label: uiStrings.nav.contact },
];

export function Header() {
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="font-semibold text-slate-900 dark:text-white">
          {t(resumeData.name)}
        </a>

        <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex dark:text-slate-300">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {t(item.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-sm hover:border-indigo-400 dark:border-slate-600"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-200"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'EN | 中' : '中 | EN'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-sm hover:border-indigo-400 dark:border-slate-600 sm:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <nav
        className={`overflow-hidden px-4 text-sm font-medium text-slate-600 transition-all duration-300 ease-in-out sm:hidden dark:text-slate-300 ${
          menuOpen ? 'max-h-60 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            >
              {t(item.label)}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
