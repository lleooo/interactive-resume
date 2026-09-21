import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { ChatLauncher } from './ChatLauncher';
import { ChatMessage } from './ChatMessage';
import { useSendMessage } from './useSendMessage';
import type { ChatApiMessage } from './api';
import type { ChatMessage as ChatMessageType } from './types';

const suggestedQuestions = [
  { en: 'Who are you?', zh: '你是誰？' },
  { en: 'How many years of frontend experience do you have?', zh: '你有幾年前端經驗？' },
  { en: 'What tech are you most familiar with?', zh: '你最熟悉哪些技術？' },
  { en: 'What React projects have you built?', zh: '你做過哪些 React 專案？' },
  { en: 'Do you have WebRTC experience?', zh: '你有 WebRTC 經驗嗎？' },
  { en: 'Do you have DevOps / Cloud experience?', zh: '你有 DevOps / Cloud 經驗嗎？' },
  { en: 'What was your most challenging project?', zh: '你做過哪些最有挑戰性的專案？' },
  { en: 'What are you currently learning?', zh: '你目前正在學習什麼？' },
  { en: 'Why did you want to become a frontend engineer?', zh: '為什麼你會想做 Frontend Engineer？' },
  { en: 'What problem did you solve and how?', zh: '你過去遇到什麼問題，又是怎麼解決的？' },
];

const DAILY_LIMIT = 20;

function todayKey() {
  return `resume-chat-count-${new Date().toISOString().slice(0, 10)}`;
}

function readDailyCount(): number {
  try {
    return Number(localStorage.getItem(todayKey()) ?? '0');
  } catch {
    return 0;
  }
}

function writeDailyCount(count: number) {
  try {
    localStorage.setItem(todayKey(), String(count));
  } catch {
    // ignore write failures
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatWidget() {
  const { lang, t } = useLanguage();
  const strings = uiStrings.chatbot;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [dailyCount, setDailyCount] = useState(readDailyCount);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutateAsync, isPending } = useSendMessage();

  const limitReached = dailyCount >= DAILY_LIMIT;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: makeId(), sender: 'bot', text: t(strings.greeting) }]);
    }
  }, [isOpen, messages.length, strings.greeting, t]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, isOpen, isPending]);

  async function respondTo(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isPending || limitReached) return;

    const userMessage: ChatMessageType = { id: makeId(), sender: 'user', text: trimmed };
    const history: ChatApiMessage[] = [...messages, userMessage].map((m) => ({
      role: m.sender === 'bot' ? 'assistant' : 'user',
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      const reply = await mutateAsync({ messages: history, lang });
      setMessages((prev) => [...prev, { id: makeId(), sender: 'bot', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: makeId(), sender: 'bot', text: t(strings.error) }]);
    } finally {
      const next = dailyCount + 1;
      setDailyCount(next);
      writeDailyCount(next);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    respondTo(inputValue);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <span className="font-semibold">{t(strings.title)}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isPending && (
              <ChatMessage message={{ id: 'pending', sender: 'bot', text: t(strings.thinking) }} />
            )}

            {messages.length <= 1 && !isPending && (
              <div className="pt-2">
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t(strings.suggestedHeading)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q.en}
                      type="button"
                      onClick={() => respondTo(t(q))}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200"
                    >
                      {t(q)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
            {limitReached && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{t(strings.dailyLimitReached)}</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
        </div>
      )}

      <ChatLauncher isOpen={isOpen} isThinking={isPending} onToggle={() => setIsOpen((prev) => !prev)} />
    </div>
  );
}
