import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';

// One-page PDFs generated from resume-print/ by `npm run resume:pdf`.
// Groups keep their own language's title regardless of the site language;
// only the Preview/Download labels follow it.
const RESUME_FILES = [
  {
    title: '中文履歷',
    href: '/resume/leo-liu-resume-zh.pdf',
    downloadName: '劉楷珉-履歷.pdf',
  },
  {
    title: 'English Resume',
    href: '/resume/leo-liu-resume-en.pdf',
    downloadName: 'Leo-Liu-Resume.pdf',
  },
];

const itemClass =
  'flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600 focus:outline-none dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400 dark:focus:bg-slate-800 dark:focus:text-indigo-400';

interface ResumeFileMenuProps {
  buttonClassName: string;
}

export function ResumeFileMenu({ buttonClassName }: ResumeFileMenuProps) {
  const { t } = useLanguage();
  const strings = uiStrings.resumeFile;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const items = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ??
        [],
    );

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      list[(index + 1) % list.length]?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      list[(index - 1 + list.length) % list.length]?.focus();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${buttonClassName} w-9`}
        aria-label={t(strings.menuLabel)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        📄
      </button>
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={t(strings.menuLabel)}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-full mt-2 w-60 space-y-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
        >
          {RESUME_FILES.map((file) => (
            <div key={file.href} role="group" aria-label={file.title}>
              <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {file.title}
              </p>
              <div className="flex gap-1">
                <a
                  role="menuitem"
                  href={file.href}
                  target="_blank"
                  rel="noopener"
                  onClick={() => close(false)}
                  className={itemClass}
                >
                  <span aria-hidden="true">👁</span>
                  {t(strings.preview)}
                </a>
                <a
                  role="menuitem"
                  href={file.href}
                  download={file.downloadName}
                  onClick={() => close(false)}
                  className={itemClass}
                >
                  <span aria-hidden="true">⬇</span>
                  {t(strings.download)}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
