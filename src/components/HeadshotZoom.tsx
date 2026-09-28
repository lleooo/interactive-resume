import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

const SRC = '/headshot/headshot.jpg';
const LAYOUT_ID = 'headshot';
// borderRadius goes through `style` so Motion can scale-correct it during the layout animation.
const round = { borderRadius: '50%' };
const imgClass =
  'aspect-square object-cover shadow-lg ring-4 ring-white dark:ring-slate-900';

interface HeadshotZoomProps {
  alt: string;
  label: string;
}

export function HeadshotZoom({ alt, label }: HeadshotZoomProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Capture phase on window runs before ResumePanel's bubble-phase listener,
    // so Escape closes only the zoomed photo, not the whole panel.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className="h-24 w-24 cursor-zoom-in rounded-full transition-transform duration-300 hover:-rotate-3 hover:scale-105"
      >
        {!open && (
          <motion.img
            layoutId={LAYOUT_ID}
            src={SRC}
            alt={alt}
            style={round}
            className={`h-full w-full ${imgClass}`}
          />
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.img
                layoutId={LAYOUT_ID}
                src={SRC}
                alt={alt}
                style={round}
                className={`w-[min(70vw,360px)] ${imgClass}`}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </MotionConfig>
  );
}
