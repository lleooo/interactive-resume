import { useEffect, useRef, useSyncExternalStore } from 'react';

export type RobotMood = 'idle' | 'happy' | 'thinking';

interface RobotHeadProps {
  mood: RobotMood;
  /** Bump this number to make the robot blink once (e.g. on click). */
  blinkSignal: number;
  className?: string;
}

// Gaze is a vector in [-1, 1]²; everything below scales it into pixels / degrees.
const PUPIL_TRAVEL = 3.2; // ≈35% of the eye radius (9)
const MAX_TURN_Y = 10; // deg
const MAX_TURN_X = 8; // deg
const REACH_PX = 120; // pointer distance at which the gaze is fully deflected
const TIME_CONSTANT = 0.13; // seconds; ≈12% catch-up per frame at 60fps
const THINKING_GAZE = { x: 0.4, y: -0.9 };

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

const MOUTHS: Record<RobotMood, string> = {
  idle: 'M42 67 Q50 70 58 67',
  happy: 'M40 64 Q50 75 60 64',
  thinking: 'M42 67 Q46 64 50 67 T58 67',
};

export function RobotHead({ mood, blinkSignal, className }: RobotHeadProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef(mood);
  const wakeRef = useRef<(() => void) | null>(null);
  const blinkRef = useRef<(() => void) | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const head = root?.querySelector<HTMLElement>('[data-head]');
    const plate = root?.querySelector<SVGGElement>('[data-plate]');
    const face = root?.querySelector<SVGGElement>('[data-face]');
    if (!root || !head || !plate || !face) return;
    const eyes = root.querySelectorAll<SVGGElement>('[data-eye]');
    const pupils = root.querySelectorAll<SVGGElement>('[data-pupil]');

    const gaze = { x: 0, y: 0 };
    const aim = { x: 0, y: 0 }; // where the pointer (or an idle glance) wants us to look
    let frame = 0;
    let last = 0;

    const target = () => (moodRef.current === 'thinking' ? THINKING_GAZE : aim);

    const apply = () => {
      const { x, y } = gaze;
      head.style.transform = `rotateX(${-y * MAX_TURN_X}deg) rotateY(${x * MAX_TURN_Y}deg)`;
      plate.setAttribute('transform', `translate(${x * 2.5} ${y * 2})`);
      face.setAttribute('transform', `translate(${x * 1.5} ${y})`);
      pupils.forEach((p) =>
        p.setAttribute('transform', `translate(${x * PUPIL_TRAVEL} ${y * PUPIL_TRAVEL})`),
      );
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = target();
      const k = 1 - Math.exp(-dt / TIME_CONSTANT);
      gaze.x += (t.x - gaze.x) * k;
      gaze.y += (t.y - gaze.y) * k;
      apply();
      const settled = Math.abs(t.x - gaze.x) + Math.abs(t.y - gaze.y) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    // Start easing towards the current target; the loop stops itself once settled.
    const wake = () => {
      if (reduced) {
        const t = target();
        gaze.x = t.x;
        gaze.y = t.y;
        apply();
      } else if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    wakeRef.current = wake;
    apply();
    wake();

    if (reduced) {
      blinkRef.current = null;
      return () => {
        wakeRef.current = null;
      };
    }

    const blink = () => {
      eyes.forEach((eye) =>
        eye.animate(
          [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.1)', offset: 0.5 }, { transform: 'scaleY(1)' }],
          { duration: 180, easing: 'ease-in-out' },
        ),
      );
    };
    blinkRef.current = blink;

    let blinkTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        blink();
        scheduleBlink();
      }, 3000 + Math.random() * 3000);
    };
    scheduleBlink();

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = root.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / REACH_PX, 1);
      aim.x = (dx / dist) * reach;
      aim.y = (dy / dist) * reach;
      wake();
    };
    const onLeave = () => {
      aim.x = 0;
      aim.y = 0;
      wake();
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    // No pointer to follow on touch devices, so glance around on our own.
    let glanceTimer = 0;
    if (window.matchMedia('(hover: none)').matches) {
      const glance = () => {
        glanceTimer = window.setTimeout(() => {
          aim.x = (Math.random() * 2 - 1) * 0.8;
          aim.y = (Math.random() * 2 - 1) * 0.4;
          wake();
          glanceTimer = window.setTimeout(() => {
            aim.x = 0;
            aim.y = 0;
            wake();
            glance();
          }, 900 + Math.random() * 700);
        }, 2000 + Math.random() * 3000);
      };
      glance();
    }

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(blinkTimer);
      clearTimeout(glanceTimer);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      wakeRef.current = null;
      blinkRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    moodRef.current = mood;
    wakeRef.current?.();
  }, [mood]);

  useEffect(() => {
    if (blinkSignal > 0) blinkRef.current?.();
  }, [blinkSignal]);

  return (
    <div ref={rootRef} className={className} style={{ perspective: '300px' }} aria-hidden>
      <div data-head className="h-full w-full will-change-transform">
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-lg" focusable="false">
          {/* antenna */}
          <line x1="50" y1="22" x2="50" y2="11" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="8" r="5" fill="#a5b4fc" />

          {/* ears */}
          <rect x="6" y="44" width="10" height="20" rx="5" fill="#4338ca" />
          <rect x="84" y="44" width="10" height="20" rx="5" fill="#4338ca" />

          {/* head shell */}
          <rect x="14" y="22" width="72" height="64" rx="20" fill="#4f46e5" />
          <path d="M24 34 Q24 26 34 26 H48" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* face plate + features (shifted for a fake-3D parallax) */}
          <g data-plate>
            <rect x="22" y="32" width="56" height="44" rx="14" fill="#1e1b4b" />
            <g data-face>
              {[38, 62].map((cx) => (
                <g key={cx} data-eye style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                  <circle cx={cx} cy="50" r="9" fill="#fff" />
                  <g data-pupil>
                    <circle cx={cx} cy="50" r="4.5" fill="#1e1b4b" />
                    <circle cx={cx + 1.5} cy="48.5" r="1.3" fill="#fff" />
                  </g>
                </g>
              ))}
              <path d={MOUTHS[mood]} stroke="#c7d2fe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
