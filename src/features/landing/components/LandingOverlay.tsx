import { MotionConfig, motion, type Variants } from 'motion/react';
import { useLanguage } from '../../../shared/i18n/LanguageContext';
import { uiStrings } from '../../../shared/i18n/ui-strings';
import { resumeData } from '../../../shared/data/resume-data';
import { useBootLoaderDone } from '../../../shared/hooks/useBootLoaderDone';

// Each piece of text rises in, one after another, once the parent goes `shown`.
const riseGroup: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12 } },
};
const riseItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

interface LandingOverlayProps {
  onOpenResume: () => void;
}

export function LandingOverlay({ onOpenResume }: LandingOverlayProps) {
  const { t } = useLanguage();
  const { name, title, contact } = resumeData;
  const strings = uiStrings.landing;
  const contactStrings = uiStrings.contact;
  // Hold everything hidden under the boot loader, then rise in.
  const bootDone = useBootLoaderDone();
  const group = {
    variants: riseGroup,
    initial: 'hidden',
    animate: bootDone ? 'shown' : 'hidden',
  } as const;

  return (
    <MotionConfig reducedMotion="user">
      {/* Desktop: name and title on either side of the character. */}
      <motion.div className="hidden md:contents" {...group}>
        <div className=" pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6 md:px-40 lg:px-60">
          <motion.div className="pointer-events-auto" variants={riseItem}>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {t(strings.greeting)}
            </p>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-6xl dark:text-white">
              {t(name)}
            </h1>
          </motion.div>
          <motion.div
            className="pointer-events-auto text-right"
            variants={riseItem}
          >
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
              {t(title)}
            </p>
          </motion.div>
        </div>

        <div className="pointer-events-auto absolute bottom-6 left-6 flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {t(contactStrings.email)}
          </a>
        </div>

        {/* Animated through a wrapper: the button's own CSS `transition`
            would fight Motion's per-frame transform. */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          variants={riseItem}
        >
          <button
            type="button"
            onClick={onOpenResume}
            className="pointer-events-auto rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-500/30"
          >
            {t(strings.resumeCta)}
          </button>
        </motion.div>
      </motion.div>

      {/* Mobile: full-body character with the text stacked over its lower
          half, bottom-left, and a copyright line at the very bottom. */}
      <motion.div className="md:hidden" {...group}>
        <div className="pointer-events-none absolute inset-x-0 bottom-20 px-6">
          {/* It sits over the character's clothes, so a halo in the page
              color keeps it readable on both light and dark patches. */}
          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-800 [text-shadow:0_0_2px_rgb(255_255_255),0_0_12px_rgb(255_255_255/0.9)] dark:text-white dark:[text-shadow:0_0_2px_rgb(0_0_0),0_0_12px_rgb(0_0_0/0.9)]"
            variants={riseItem}
          >
            {t(title)}
          </motion.p>
          <h1 className="mt-4 text-6xl font-bold leading-none text-slate-900 dark:text-white">
            {t(name)
              .split(' ')
              .map((part) => (
                <motion.span key={part} className="block" variants={riseItem}>
                  {part}
                </motion.span>
              ))}
          </h1>
          <motion.button
            type="button"
            onClick={onOpenResume}
            className="pointer-events-auto mt-8 rounded-full border border-slate-900/20 bg-slate-900/5 px-12 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 backdrop-blur dark:border-white/25 dark:bg-white/5 dark:text-white"
            variants={riseItem}
          >
            {t(strings.resumeCta)}
          </motion.button>
        </div>
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs tracking-widest text-slate-500 dark:text-slate-400">
          Copyright © {new Date().getFullYear()} {t(name)}
        </p>
      </motion.div>
    </MotionConfig>
  );
}
