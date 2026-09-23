import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { preloadCharacterModel } from './model/preload';
import { RobotHead } from './RobotHead';

const INTRO_BUBBLE_MS = 5000;

interface ChatLauncherProps {
  isOpen: boolean;
  isThinking: boolean;
  onToggle: () => void;
}

export function ChatLauncher({
  isOpen,
  isThinking,
  onToggle,
}: ChatLauncherProps) {
  const { t } = useLanguage();
  const strings = uiStrings.chatbot;
  const [intro, setIntro] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [blinkSignal, setBlinkSignal] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), INTRO_BUBBLE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Blink on a click anywhere on the page, not just on the head.
  useEffect(() => {
    const onPointerDown = () => setBlinkSignal((n) => n + 1);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const engaged = hovered || keyboardFocused;
  const bubbleVisible = !isOpen && (intro || engaged);
  const mood = isThinking ? 'thinking' : engaged ? 'happy' : 'idle';

  return (
    <button
      type="button"
      onClick={onToggle}
      onPointerEnter={() => {
        setHovered(true);
        preloadCharacterModel();
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => {
        setKeyboardFocused(e.currentTarget.matches(':focus-visible'));
        preloadCharacterModel();
      }}
      onBlur={() => setKeyboardFocused(false)}
      aria-label={isOpen ? t(strings.closeLabel) : t(strings.openLabel)}
      aria-expanded={isOpen}
      className="relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <span
        aria-hidden
        className={`absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-lg ring-1 ring-slate-900/5 transition-opacity duration-300 dark:bg-slate-800 dark:text-white dark:ring-white/10 ${
          bubbleVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {t(strings.openLabel)}
        <span className="absolute -right-1 top-1/2 size-2.5 -translate-y-1/2 rotate-45 rounded-xs bg-white dark:bg-slate-800" />
      </span>
      <RobotHead
        mood={mood}
        blinkSignal={blinkSignal}
        className="h-16 w-16 sm:h-18 sm:w-18"
      />
    </button>
  );
}
