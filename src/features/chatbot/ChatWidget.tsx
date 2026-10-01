import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../shared/i18n/LanguageContext';
import { uiStrings } from '../../shared/i18n/ui-strings';
import { ChatLauncher } from './components/ChatLauncher';
import { ChatThread } from './components/ChatThread';
import { RobotHead } from './components/RobotHead';
import { useSendMessage } from './hooks/useSendMessage';
import type { ChatApiMessage } from './api';
import type { ChatMessage as ChatMessageType } from './types';
import type { Bilingual } from '../../shared/i18n/types';

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
  const [askedKeys, setAskedKeys] = useState<ReadonlySet<string>>(() => new Set());
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

  function handleSuggestedClick(question: Bilingual) {
    if (isPending || limitReached) return;
    // Re-insert so the Set's order is "most recently asked last".
    setAskedKeys((prev) => {
      const next = new Set(prev);
      next.delete(question.en);
      return next.add(question.en);
    });
    respondTo(t(question));
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <RobotHead mood={isPending ? 'thinking' : 'idle'} blinkSignal={0} className="h-8 w-8" />
              <span className="font-semibold text-slate-800 dark:text-white">{t(strings.title)}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t(strings.closeLabel)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-900/5 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <ChatThread
            messages={messages}
            isPending={isPending}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmit}
            limitReached={limitReached}
            suggestedQuestions={suggestedQuestions}
            askedKeys={askedKeys}
            onSuggestedClick={handleSuggestedClick}
            scrollRef={scrollRef}
          />
        </div>
      )}

      <ChatLauncher isOpen={isOpen} isThinking={isPending} onToggle={() => setIsOpen((prev) => !prev)} />
    </div>
  );
}
