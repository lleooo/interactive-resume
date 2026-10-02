import { useEffect, useState, type RefObject } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
import { useLanguage } from '../../../shared/i18n/LanguageContext';
import { uiStrings } from '../../../shared/i18n/ui-strings';

const strings = uiStrings.resumeNav;

// Section ids as set on each resume section, in page order.
const LINKS = [
  { id: 'top', label: strings.about },
  { id: 'experience', label: strings.experience },
  { id: 'projects', label: strings.projects },
  { id: 'skills', label: strings.skills },
];

interface ResumeNavProps {
  /** The resume's scroll container (not the window). */
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function ResumeNav({ scrollRef }: ResumeNavProps) {
  const { t } = useLanguage();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeId, setActiveId] = useState(LINKS[0].id);

  // Scroll-spy: the current section is the last one whose top has reached the
  // spot a jump to it would leave it at (its scroll-margin below the scroller
  // top), so a clicked link always lights up. Re-checked on scroll and whenever a section resizes (the project
  // filter changes its height without any scrolling).
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const sections = LINKS.flatMap(
      ({ id }) => document.getElementById(id) ?? [],
    );

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollerTop = scroller.getBoundingClientRect().top;
      const atBottom =
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      // The last section may be too short to ever reach the nav.
      const current = atBottom
        ? sections.at(-1)
        : sections.findLast(
            (el) =>
              el.getBoundingClientRect().top - scrollerTop <=
              parseFloat(getComputedStyle(el).scrollMarginTop) + 1,
          );
      setActiveId(current?.id ?? LINKS[0].id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', schedule, { passive: true });
    const resizeObserver = new ResizeObserver(schedule);
    sections.forEach((el) => resizeObserver.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      resizeObserver.disconnect();
    };
  }, [scrollRef]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label={t(strings.label)}
        // Same max width and padding as ResumePanel's <main>, so the links
        // split exactly the resume card's width between them.
        className="mx-auto flex max-w-[794px] px-3 sm:px-6"
      >
        {LINKS.map(({ id, label }) => {
          const active = id === activeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              aria-current={active ? 'location' : undefined}
              className={`relative flex-1 whitespace-nowrap px-1 py-3 text-center text-sm font-medium transition-colors sm:text-base ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
              }`}
            >
              {t(label)}
              {active && (
                <motion.span
                  layoutId="resume-nav-indicator"
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                />
              )}
            </button>
          );
        })}
      </nav>
    </MotionConfig>
  );
}
