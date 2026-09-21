import { useMemo, useSyncExternalStore } from 'react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from '../theme/ThemeContext';
import type { Theme } from '../theme/types';

// --- Tunables -------------------------------------------------------------
// Below this width the resume card leaves almost no gutter, so skip particles.
const MIN_WIDTH_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Particles per DENSITY_AREA, scaled to the viewport and capped at MAX_PARTICLES.
const PARTICLE_COUNT = 100;
const MAX_PARTICLES = 120;
const DENSITY_AREA = { width: 1920, height: 1080 };

const PARTICLE_SIZE = { min: 1, max: 3 };
const PARTICLE_SPEED = 0.6;
const PARTICLE_OPACITY = 0.3;
const LINK_DISTANCE = 140;
const LINK_OPACITY = 0.8;
const GRAB_DISTANCE = 180;
const REPULSE_DISTANCE = 80;

const PALETTE: Record<Theme, { particles: string[]; links: string }> = {
  light: { particles: ['#5ff6088b'], links: '#02920e' }, // indigo-500
  dark: { particles: ['#818cf8'], links: '#818cf8' }, // indigo-400, fuchsia-400
};
// --------------------------------------------------------------------------

// Must be a stable reference: ParticlesProvider runs it once for the whole app.
const initEngine = (engine: Engine) => loadSlim(engine);

function buildOptions(theme: Theme): ISourceOptions {
  const colors = PALETTE[theme];
  return {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    pauseOnBlur: true,
    particles: {
      number: {
        value: PARTICLE_COUNT,
        limit: { mode: 'delete', value: MAX_PARTICLES },
        density: { enable: true, ...DENSITY_AREA },
      },
      // v4 has no `particles.color`; fill color lives in `paint` (one entry per color).
      paint: colors.particles.map((value) => ({
        fill: { enable: true, color: { value } },
      })),
      opacity: { value: PARTICLE_OPACITY },
      size: { value: PARTICLE_SIZE },
      links: {
        enable: true,
        color: colors.links,
        distance: LINK_DISTANCE,
        opacity: LINK_OPACITY,
        width: 1,
      },
      move: {
        enable: true,
        speed: PARTICLE_SPEED,
        outModes: { default: 'out' },
      },
    },
    interactivity: {
      // The canvas is pointer-events-none, so listen on window instead.
      detectsOn: 'window',
      events: { onHover: { enable: true, mode: ['grab', 'repulse'] } },
      modes: {
        grab: { distance: GRAB_DISTANCE, links: { opacity: LINK_OPACITY * 2 } },
        repulse: { distance: REPULSE_DISTANCE },
      },
    },
  };
}

function subscribeToQuery(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => subscribeToQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function ParticleBackground() {
  const { theme } = useTheme();
  const isWide = useMediaQuery(MIN_WIDTH_QUERY);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  // Particles reloads whenever the options reference changes, so memoize per theme.
  const options = useMemo(() => buildOptions(theme), [theme]);

  if (!isWide || prefersReducedMotion) return null;

  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="particle-background"
        className="pointer-events-none fixed inset-0 z-0"
        options={options}
      />
    </ParticlesProvider>
  );
}
