'use client';

import { useStore } from '@/store/useStore';
import { translations, TranslationKey } from './translations';

/**
 * useT() — translation hook
 *
 * Usage:
 *   const t = useT();
 *   <p>{t('home_hero_title')}</p>
 *   <p>{t('shop_years', { count: shop.age })}</p>  // optional interpolation
 *
 * Falls back to English if Hindi key is missing.
 * Shows a console.warn in dev for missing keys.
 */
export function useT() {
  const { language } = useStore();

  return function t(
    key: TranslationKey,
    vars?: Record<string, string | number>,
  ): string {
    const dict = translations[language] as Record<string, string>;
    const fallback = translations['en'] as Record<string, string>;

    let str = dict[key] ?? fallback[key];

    if (!str) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useT] Missing translation key: "${key}"`);
      }
      return key; // return the key itself as last resort
    }

    // Simple variable interpolation: {{varName}}
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      });
    }

    return str;
  };
}