import { createI18n } from 'vue-i18n';
import en from './locales/en/index';
import zh from './locales/zh/index';

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 默认中文
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});

export default i18n;
