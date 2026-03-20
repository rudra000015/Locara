'use client';

import { useStore } from '@/store/useStore';

export default function LanguageToggle() {
  const { language, setLanguage } = useStore();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="h-11 px-3 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all hover:scale-105 active:scale-95 font-black text-xs"
      style={{
        background: 'var(--bg-card)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--fg-muted)',
        minWidth: 56,
      }}
      aria-label="Toggle language"
      title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      {language === 'en' ? 'EN' : 'हिं'}
    </button>
  );
}

