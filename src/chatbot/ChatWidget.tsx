import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { uiStrings } from '../i18n/ui-strings';
import { ChatLauncher } from './ChatLauncher';
import { CompanionDock } from './CompanionDock';
import { useCharacterState } from './useCharacterState';
import { useMediaQuery } from './model/useMediaQuery';
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

interface ChatWidgetProps {
  /** Hides the idle dock / launcher while true, e.g. on the landing view
   * where that corner is occupied by the "RESUME" trigger. An already-open
   * Chat Panel is left alone. */
  suppressIdle?: boolean;
}

export function ChatWidget({ suppressIdle = false }: ChatWidgetProps) {
  const { lang, t } = useLanguage();
  const strings = uiStrings.chatbot;
  // Fine-pointer devices get the persistent Companion (ADR-0001); coarse
  // pointer (touch) devices get the flat launcher icon and only load the 3D
  // character once tapped.
  const isDesktop = !useMediaQuery('(pointer: coarse)');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [dailyCount, setDailyCount] = useState(readDailyCount);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutateAsync, isPending } = useSendMessage();
  const { tier, characterState, isChatOpen, openPanel, expand, collapse, requestClose } = useCharacterState(
    isPending,
    messages,
    isDesktop,
  );

  const limitReached = dailyCount >= DAILY_LIMIT;

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{ id: makeId(), sender: 'bot', text: t(strings.greeting) }]);
    }
  }, [isChatOpen, messages.length, strings.greeting, t]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, isChatOpen, isPending]);

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

  if (tier === 'hidden') {
    if (suppressIdle) return null;
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <ChatLauncher isOpen={false} isThinking={false} onToggle={openPanel} />
      </div>
    );
  }

  if (tier === 'idle' && suppressIdle) return null;

  return (
    <CompanionDock
      tier={tier}
      characterState={characterState}
      onOpenPanel={openPanel}
      onExpand={expand}
      onCollapse={collapse}
      onClose={requestClose}
      messages={messages}
      isPending={isPending}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      limitReached={limitReached}
      suggestedQuestions={suggestedQuestions}
      onSuggestedClick={respondTo}
      showSuggested={messages.length <= 1 && !isPending}
      scrollRef={scrollRef}
    />
  );
}
