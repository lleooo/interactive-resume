import { Suspense, lazy } from 'react';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
import { useTabVisible } from '../../../shared/hooks/useTabVisible';

const CharacterHost = lazy(() =>
  import('./CharacterHost').then((m) => ({
    default: m.CharacterHost,
  })),
);

interface LandingCharacterProps {
  /** Only the landing view needs this character rendering/animating. */
  active: boolean;
}

export function LandingCharacter({ active }: LandingCharacterProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  // Below Tailwind's md breakpoint (same one LandingOverlay switches at) the
  // screen is tall and narrow, so show the whole body instead of the bust.
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTabVisible = useTabVisible();

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="size-16 animate-pulse rounded-full bg-indigo-500/20" />
        </div>
      }
    >
      <CharacterHost
        state="idle"
        reducedMotion={reducedMotion}
        isCoarsePointer={isCoarsePointer}
        isTabVisible={isTabVisible && active}
        mouseLook={active && !reducedMotion && !isCoarsePointer}
        framing={isMobile ? 'full' : 'bust'}
        // Tighter fit on mobile so the full body nearly fills the height.
        fitMargin={isMobile ? 1.05 : undefined}
        fitKey={`landing-${isMobile ? 'full' : 'bust'}`}
        transparentBackground
      />
    </Suspense>
  );
}
