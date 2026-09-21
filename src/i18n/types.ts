export type Lang = 'en' | 'zh';

export type Bilingual<T = string> = {
  en: T;
  zh: T;
};
