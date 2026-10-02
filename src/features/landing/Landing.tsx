import { LandingCharacter } from './components/LandingCharacter';
import { GlowBackground } from './components/GlowBackground';
import { LandingOverlay } from './components/LandingOverlay';

interface LandingProps {
  active: boolean;
  /** Freeze the animated background and character, e.g. behind the chat. */
  paused: boolean;
  onOpenResume: () => void;
}

export function Landing({ active, paused, onOpenResume }: LandingProps) {
  return (
    <section
      className="fixed inset-0 z-20 overflow-hidden bg-slate-50 dark:bg-black"
      inert={!active}
      aria-hidden={!active}
    >
      <GlowBackground paused={paused} />

      <div className="absolute inset-0">
        <LandingCharacter active={active} paused={paused} />
      </div>

      <LandingOverlay onOpenResume={onOpenResume} />
    </section>
  );
}
