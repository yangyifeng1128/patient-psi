import { LocaleCode } from '@/lib/locale';

export type LocaleControlTranslations = {
  [key in LocaleCode]: string;
} & {};

export type LocaleControlMessages = Record<LocaleCode, LocaleControlTranslations>;

export const messages: LocaleControlMessages = {
  en: {
    en: 'English',
    'zh-CN': 'Simplified Chinese',
  },
  'zh-CN': {
    en: '英语',
    'zh-CN': '简体中文',
  },
};

export function getTranslations(localeCode: LocaleCode) {
  const translations = Object.entries(messages).filter(([messagesKey]) => messagesKey === localeCode)?.[0]?.[1];

  return (key: keyof LocaleControlTranslations) => {
    return translations ? translations[key] : null;
  };
}
