import type { RefObject } from 'react';
import { useLanguage } from '../../../shared/i18n/LanguageContext';
import { uiStrings } from '../../../shared/i18n/ui-strings';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types';
import type { Bilingual } from '../../../shared/i18n/types';

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
  inputRef: RefObject<HTMLInputElement | null>;
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
  inputRef,
}: ChatThreadProps) {
  const { t } = useLanguage();
  const strings = uiStrings.chatbot;

  // Unasked questions keep their original order; asked ones follow in the
  // order they were asked (askedKeys is insertion-ordered).
  const byKey = new Map(suggestedQuestions.map((q) => [q.en, q]));
  const orderedQuestions = [
    ...suggestedQuestions.filter((q) => !askedKeys.has(q.en)),
    ...[...askedKeys].flatMap((key) => byKey.get(key) ?? []),
  ];

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
        // Wrapped, ten chips can take several rows; cap it so the thread keeps the room.
        <div className="flex max-h-32 shrink-0 flex-wrap gap-2 overflow-y-auto border-t border-slate-200 px-3 py-2 dark:border-slate-700">
          {orderedQuestions.map((q) => (
            <button
              key={q.en}
              type="button"
              onClick={() => onSuggestedClick(q)}
              disabled={isPending}
              className={`rounded-full border px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 ${
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
            ref={inputRef}
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
