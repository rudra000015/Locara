'use client';

import { useState } from 'react';
import { Compass, LogIn, Store } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useT } from '@/i18n/useT';
// import LanguageToggle from '@/components/ui/LanguageToggle';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [role, setRole] = useState<'explorer' | 'owner'>('explorer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, showToast } = useStore();
  const t = useT();

  const triggerSuccess = (userData: any, userRole: 'explorer' | 'owner') => {
    setUser(userData, userRole);
    onLoginSuccess(); 
  };

  const handleLogin = () => {
    if (!email || !password) { setError(t('auth_enter_email_password')); return; }
    showToast(t('toast_signing_in'));
    setTimeout(() => {
      triggerSuccess({ 
        name: email.split('@')[0], 
        img: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}` 
      }, role);
    }, 800);
  };

  const handleSignup = () => {
    if (!email || !password) { setError(t('auth_enter_email_password')); return; }
    showToast(t('toast_creating_account'));
    setTimeout(() => {
      showToast(t('toast_account_created'));
      triggerSuccess({ 
        name: email.split('@')[0], 
        img: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}` 
      }, role);
    }, 1200);
  };

  const handleGoogle = () => {
    showToast(t('toast_connecting_google'));
    setTimeout(() => {
      triggerSuccess({ 
        name: 'Heritage Explorer', 
        img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Google' 
      }, role);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-transparent">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        {/* Copper Accent Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#b87333]/10 rounded-full blur-3xl" />
    

        <div className="text-center mb-6 sm:mb-8 relative z-10">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl shadow-lg">
            {role === 'explorer' ? <Compass className="w-7 h-7" /> : <Store className="w-7 h-7" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-1">
            {role === 'explorer' ? 'Welcome to' : 'Partner with'}
          </h1>
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#8d5524] to-[#b87333] bg-clip-text text-transparent mb-2">
         LOCARA
          </h2>
          <p className="text-gray-500 font-medium text-xs sm:text-sm uppercase tracking-widest">
            {role === 'explorer' ? 'Unveiling The Local Treasure' : 'Bring your shop to the world'}
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex mb-6 sm:mb-8 bg-gray-50 p-1 rounded-xl relative z-10 gap-1 sm:gap-0">
          {(['explorer', 'owner'] as const).map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setError(''); }}
              className={`flex-1 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                role === r ? 'bg-white shadow text-[#8d5524]' : 'text-gray-500'
              }`}
            >
              {r === 'explorer' ? (
                <Compass className="mr-1 sm:mr-2 w-4 h-4" />
              ) : (
                <Store className="mr-1 sm:mr-2 w-4 h-4" />
              )}
              <span className="hidden sm:inline">{r === 'explorer' ? 'Explorer' : 'Shop Owner'}</span>
              <span className="sm:hidden">{r === 'explorer' ? 'Explorer' : 'Owner'}</span>
            </button>
          ))}
        </div>

        {/* Login Form - Same for both roles */}
        <div className="space-y-3 sm:space-y-4 relative z-10">
          <button
            onClick={handleGoogle}
            className="w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all"
          >
            <LogIn className="w-4 sm:w-5 h-4 sm:h-5" />
            {t('auth_continue_google')}
          </button>

          <div className="flex py-2 sm:py-3 items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-2 sm:mx-4 text-gray-400 text-xs font-bold uppercase">{t('auth_or_email')}</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <input type="email" placeholder={t('auth_email')} value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm sm:text-base border border-gray-200 outline-none focus:border-[#8d5524] bg-white transition-all" />
          <input type="password" placeholder={t('auth_password')} value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm sm:text-base border border-gray-200 outline-none focus:border-[#8d5524] bg-white transition-all" />

          <button
            onClick={handleLogin}
            className="w-full py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg shadow-lg bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            {role === 'explorer' ? t('auth_start_exploring') : t('auth_access_shop')}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
            {t('auth_new')}{' '}
            <button onClick={handleSignup} className="text-[#8d5524] font-bold hover:underline transition-all">
              {t('auth_create_account')}
            </button>
          </p>

          {error && <p className="text-center text-xs sm:text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">{error}</p>}
        </div>
      </div>
    </div>
  );
}
