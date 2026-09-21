import { useMutation } from '@tanstack/react-query';
import { postChatMessage } from './api';
import type { ChatApiMessage } from './api';
import type { Lang } from '../i18n/types';

export function useSendMessage() {
  return useMutation({
    mutationFn: ({ messages, lang }: { messages: ChatApiMessage[]; lang: Lang }) =>
      postChatMessage(messages, lang),
  });
}
