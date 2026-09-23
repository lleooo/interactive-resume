import type { RefObject } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from './types';
import type { Bilingual } from '../i18n/types';

interface ChatThreadProps {
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

export function ChatThread({
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
}: ChatThreadProps) {
  const { t } = useLanguage();
  const strings = uiStrings.chatbot;

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isPending && (
          <ChatMessage message={{ id: 'pending', sender: 'bot', text: t(strings.thinking) }} />
        )}

        {showSuggested && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              {t(strings.suggestedHeading)}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q.en}
                  type="button"
                  onClick={() => onSuggestedClick(t(q))}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200"
                >
                  {t(q)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
