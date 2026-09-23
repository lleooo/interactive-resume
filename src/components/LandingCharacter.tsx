import { Suspense, lazy } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../chatbot/model/useMediaQuery';
import { useTabVisible } from '../chatbot/model/useTabVisible';

const CharacterHost = lazy(() =>
  import('../chatbot/model/CharacterHost').then((m) => ({
    default: m.CharacterHost,
  })),
);

interface LandingCharacterProps {
  /** Only the landing view needs this character rendering/animating. */
  active: boolean;
}

export function LandingCharacter({ active }: LandingCharacterProps) {
  const { theme } = useTheme();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
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
        isDark={theme === 'dark'}
        isCoarsePointer={isCoarsePointer}
        isTabVisible={isTabVisible && active}
        mouseLook={active && !reducedMotion && !isCoarsePointer}
        framing="bust"
        fitKey="landing"
        transparentBackground
      />
    </Suspense>
  );
}
