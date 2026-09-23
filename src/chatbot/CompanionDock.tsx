import { Suspense, lazy, type RefObject } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { useTheme } from '../theme/ThemeContext';
import { ChatThread } from './ChatThread';
import { useMediaQuery } from './model/useMediaQuery';
import { useTabVisible } from './model/useTabVisible';
import type { Tier } from './useCharacterState';
import type { CharacterState } from './model/animationConfig';
import type { ChatMessage as ChatMessageType } from './types';
import type { Bilingual } from '../i18n/types';

const CharacterHost = lazy(() =>
  import('./model/CharacterHost').then((m) => ({ default: m.CharacterHost })),
);

const CONTAINER_CLASSES: Record<Exclude<Tier, 'hidden'>, string> = {
  idle:
    'fixed bottom-4 right-4 z-50 h-20 w-20 overflow-hidden rounded-full shadow-lg ring-1 ring-slate-900/5 sm:h-24 sm:w-24 dark:ring-white/10',
  panel:
    'fixed bottom-4 right-4 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800',
  immersive:
    'fixed inset-0 z-60 flex flex-col bg-linear-to-br from-indigo-500/10 via-fuchsia-500/10 to-transparent bg-white/95 dark:bg-slate-900/95',
};

const CANVAS_AREA_CLASSES: Record<Exclude<Tier, 'hidden'>, string> = {
  idle: 'h-full w-full',
  panel: 'h-48 w-full shrink-0',
  immersive: 'relative min-h-0 flex-1',
};

interface CompanionDockProps {
  tier: Exclude<Tier, 'hidden'>;
  characterState: CharacterState;
  onOpenPanel: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onClose: () => void;
  messages: ChatMessageType[];
  isPending: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  limitReached: boolean;
  suggestedQuestions: Bilingual[];
  onSuggestedClick: (question: string) => void;
  showSuggested: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function CompanionDock({
  tier,
  characterState,
  onOpenPanel,
  onExpand,
  onCollapse,
  onClose,
  messages,
  isPending,
  inputValue,
  onInputChange,
  onSubmit,
  limitReached,
  suggestedQuestions,
  onSuggestedClick,
  showSuggested,
  scrollRef,
}: CompanionDockProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const strings = uiStrings.chatbot;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isTabVisible = useTabVisible();

  const canvasArea = (
    <div className={CANVAS_AREA_CLASSES[tier]}>
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <div className="size-8 animate-pulse rounded-full bg-indigo-500/20" />
            {tier !== 'idle' && <p className="text-xs">{t(strings.loadingCharacter)}</p>}
          </div>
        }
      >
        <CharacterHost
          state={characterState}
          reducedMotion={reducedMotion}
          isDark={theme === 'dark'}
          isCoarsePointer={isCoarsePointer}
          isTabVisible={isTabVisible}
          framing="bust"
          fitKey={tier}
        />
      </Suspense>
    </div>
  );

  if (tier === 'idle') {
    return (
      <button
        type="button"
        onClick={onOpenPanel}
        aria-label={t(strings.openLabel)}
        className={CONTAINER_CLASSES.idle}
      >
        {canvasArea}
      </button>
    );
  }

  const isImmersive = tier === 'immersive';

  return (
    <div className={CONTAINER_CLASSES[tier]}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-slate-800 dark:text-white">{t(strings.title)}</span>
        <div className="flex items-center gap-1">
          {isImmersive ? (
            <button
              type="button"
              onClick={onCollapse}
              aria-label={t(strings.collapseLabel)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-900/5 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              ⤡
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onExpand}
                aria-label={t(strings.expandLabel)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-900/5 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                ⤢
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label={t(strings.closeLabel)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-900/5 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {canvasArea}

      <div
        className={
          isImmersive
            ? 'flex max-h-[45vh] flex-col overflow-hidden rounded-t-3xl border-t border-slate-200 bg-white/90 shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90'
            : 'flex min-h-0 flex-1 flex-col border-t border-slate-200 dark:border-slate-700'
        }
      >
        <ChatThread
          messages={messages}
          isPending={isPending}
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          limitReached={limitReached}
          suggestedQuestions={suggestedQuestions}
          onSuggestedClick={onSuggestedClick}
          showSuggested={showSuggested}
          scrollRef={scrollRef}
        />
      </div>
    </div>
  );
}
