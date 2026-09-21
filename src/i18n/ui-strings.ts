import type { Bilingual } from './types';

export const uiStrings = {
  nav: {
    about: { en: 'About', zh: '關於我' },
    experience: { en: 'Experience', zh: '工作經歷' },
    projects: { en: 'Projects', zh: '專案經歷' },
    skills: { en: 'Skills', zh: '技術能力' },
    contact: { en: 'Contact', zh: '聯絡方式' },
  },
  hero: {
    viewExperience: { en: 'View Experience', zh: '查看經歷' },
    contactMe: { en: 'Contact Me', zh: '聯絡我' },
  },
  about: {
    heading: { en: 'About Me', zh: '關於我' },
    highlightsHeading: { en: 'Why I Stand Out', zh: '技術亮點' },
  },
  experience: {
    heading: { en: 'Work Experience', zh: '工作經歷' },
    present: { en: 'Present', zh: '至今' },
  },
  projects: {
    heading: { en: 'Projects', zh: '專案經歷' },
    role: { en: 'Role', zh: '負責角色' },
    challenge: { en: 'Challenge', zh: '遇到的挑戰' },
    solution: { en: 'What I Did', zh: '我的解法' },
    outcome: { en: 'Outcome', zh: '成果' },
    allTags: { en: 'All', zh: '全部' },
    noResults: { en: 'No projects match the selected tags.', zh: '沒有符合所選標籤的專案。' },
  },
  skills: {
    heading: { en: 'Skills', zh: '技術能力' },
  },
  contact: {
    heading: { en: "Let's Connect", zh: '聯絡方式' },
    subheading: {
      en: 'Open to frontend engineering opportunities in Taipei / New Taipei, and remote-friendly roles.',
      zh: '目前希望在台北 / 新北尋找前端工程師機會，也對遠端工作有意願。',
    },
    comingSoon: { en: 'link coming soon', zh: '連結補充中' },
    email: { en: 'Email', zh: 'Email' },
    github: { en: 'GitHub', zh: 'GitHub' },
    linkedin: { en: 'LinkedIn', zh: 'LinkedIn' },
    copyEmail: { en: 'Copy email address', zh: '複製電子郵件' },
    copied: { en: 'Copied!', zh: '已複製！' },
  },
  footer: {
    rights: { en: 'All rights reserved.', zh: '版權所有。' },
  },
  chatbot: {
    title: { en: 'Ask About Me', zh: 'Ask About Me' },
    openLabel: { en: 'Ask About Me', zh: '問我任何問題' },
    placeholder: {
      en: 'Ask about my experience, skills, or projects…',
      zh: '詢問我的經歷、技能或專案…',
    },
    greeting: {
      en: "Hi! I'm Leo's resume assistant. Ask me anything about his experience, skills, or projects — I'll only answer from what's actually on his resume.",
      zh: '嗨！我是 Leo 的履歷小助手，歡迎詢問他的經歷、技能或專案 — 我只會根據履歷中實際的內容回答喔。',
    },
    suggestedHeading: { en: 'Try asking:', zh: '你可以這樣問：' },
    send: { en: 'Send', zh: '送出' },
    thinking: { en: 'Thinking…', zh: '思考中…' },
    error: {
      en: "Sorry, something went wrong reaching the assistant. Please try again in a moment.",
      zh: '抱歉，連線發生問題，請稍後再試一次。',
    },
    dailyLimitReached: {
      en: "You've reached today's question limit — please come back tomorrow!",
      zh: '今天的提問次數已達上限，請明天再來詢問！',
    },
  },
} satisfies Record<string, Record<string, Bilingual>>;
