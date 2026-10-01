import { LandingCharacter } from './components/LandingCharacter';
import { GlowBackground } from './components/GlowBackground';
import { LandingOverlay } from './components/LandingOverlay';

interface LandingProps {
  active: boolean;
  onOpenResume: () => void;
}

export function Landing({ active, onOpenResume }: LandingProps) {
  return (
    <section
      className="fixed inset-0 z-20 overflow-hidden bg-slate-50 dark:bg-black"
      inert={!active}
      aria-hidden={!active}
    >
      <GlowBackground />

      <div className="absolute inset-0">
        <LandingCharacter active={active} />
      </div>

      <LandingOverlay onOpenResume={onOpenResume} />
    </section>
  );
}
