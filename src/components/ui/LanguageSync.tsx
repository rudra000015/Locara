'use client';

import { useEffect } from 'react';
import { useStore, type LanguageMode } from '@/store/useStore';

export default function LanguageSync() {
  const { language, setLanguage } = useStore();

  useEffect(() => {
    const saved = localStorage.getItem('language') as LanguageMode | null;
    if (saved === 'en' || saved === 'hi') setLanguage(saved);
  }, [setLanguage]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return null;
}

