import axios from 'axios';
import type { Lang } from '../i18n/types';

export interface ChatApiMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatResponse {
  reply: string;
}

const client = axios.create({ baseURL: '/api' });

export async function postChatMessage(messages: ChatApiMessage[], lang: Lang): Promise<string> {
  const { data } = await client.post<ChatResponse>('/chat', { messages, lang });
  return data.reply;
}
