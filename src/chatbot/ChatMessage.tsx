import type { ChatMessage as ChatMessageType } from './types';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-slate-100 text-slate-800 rounded-bl-sm dark:bg-slate-700 dark:text-slate-100'
            : 'bg-indigo-600 text-white rounded-br-sm'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
