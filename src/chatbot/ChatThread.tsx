import { useEffect, useRef, type RefObject } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from './types';
import type { Bilingual } from '../i18n/types';

const freshChipClass =
  'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 dark:hover:bg-indigo-900/60';
const askedChipClass =
  'border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700';

interface ChatThreadProps {
  messages: ChatMessageType[];
  isPending: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  limitReached: boolean;
  suggestedQuestions: Bilingual[];
  /** `en` keys of suggested questions already asked; shown dimmed. */
  askedKeys: ReadonlySet<string>;
  onSuggestedClick: (question: Bilingual) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function ChatThread({
  messages,
  isPending,
  inputValue,
  onInputChange,
  onSubmit,
  limitReached,
  suggestedQuestions,
  askedKeys,
  onSuggestedClick,
  scrollRef,
}: ChatThreadProps) {
  const { t } = useLanguage();
  const strings = uiStrings.chatbot;
  const suggestedRef = useRef<HTMLDivElement>(null);

  // Unasked questions keep their original order; asked ones follow in the
  // order they were asked (askedKeys is insertion-ordered).
  const byKey = new Map(suggestedQuestions.map((q) => [q.en, q]));
  const orderedQuestions = [
    ...suggestedQuestions.filter((q) => !askedKeys.has(q.en)),
    ...[...askedKeys].flatMap((key) => byKey.get(key) ?? []),
  ];

  // After a reorder, jump back to the start so the next unasked question is visible.
  useEffect(() => {
    suggestedRef.current?.scrollTo({ left: 0 });
  }, [askedKeys]);

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isPending && (
          <ChatMessage message={{ id: 'pending', sender: 'bot', text: t(strings.thinking) }} />
        )}

      </div>

      {!limitReached && (
        <div
          ref={suggestedRef}
          className="flex shrink-0 gap-2 overflow-x-auto border-t border-slate-200 px-3 py-2 dark:border-slate-700"
        >
          {orderedQuestions.map((q) => (
            <button
              key={q.en}
              type="button"
              onClick={() => onSuggestedClick(q)}
              disabled={isPending}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 ${
                askedKeys.has(q.en) ? askedChipClass : freshChipClass
              }`}
            >
              {t(q)}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
        {limitReached && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{t(strings.dailyLimitReached)}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={t(strings.placeholder)}
            disabled={limitReached}
            className="min-w-0 flex-1 rounded-full border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-indigo-500 disabled:opacity-50 dark:border-slate-600"
          />
          <button
            type="submit"
            disabled={isPending || limitReached}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {t(strings.send)}
          </button>
        </div>
      </form>
    </>
  );
}
