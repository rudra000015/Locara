'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useStore, type OwnerPage } from '@/store/useStore';
import { useT } from '@/i18n/useT';
// import LanguageToggle from '@/components/ui/LanguageToggle';
import type { TranslationKey } from '@/i18n/translations';

interface Props {
  shopName: string;
}

const OWNER_NAVS: { key: OwnerPage; labelKey: TranslationKey; icon: string }[] = [
  { key: 'showcase', labelKey: 'owner_showcase', icon: 'th-large' },
  { key: 'collections', labelKey: 'owner_collections', icon: 'layer-group' },
  { key: 'addproduct', labelKey: 'owner_add_product', icon: 'plus-circle' },
  { key: 'profile', labelKey: 'owner_shop_profile', icon: 'id-card' },
  { key: 'analytics', labelKey: 'owner_analytics', icon: 'chart-line' },
];

export default function OwnerHeader({ shopName }: Props) {
  const pathname = usePathname();
  const { logout, theme, setTheme } = useStore();
  const router = useRouter();
  const t = useT();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      style={{ background: 'linear-gradient(135deg, #1a0f0a, #2c1810)' }}
      className="text-white px-6 py-4 flex items-center justify-between shadow-lg z-40 flex-shrink-0"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#b87333]/30 rounded-xl flex items-center justify-center text-white text-xl">
          <i className="fas fa-store" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">{t('owner_dashboard')}</h1>
          <p className="text-[10px] text-[#d2b48c] uppercase tracking-widest">{shopName}</p>
        </div>
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium text-[#d2b48c]">
        {OWNER_NAVS.map(({ key, labelKey }) => (
          <button
            key={key}
            type="button"
            onClick={() => router.push(key === 'showcase' ? '/owner' : `/owner/${key}`)}
            className={`hover:text-white border-b-2 pb-1 transition-all ${
              (key === 'showcase' ? pathname === '/owner' : pathname.startsWith(`/owner/${key}`))
                ? 'text-white border-[#b87333]'
                : 'border-transparent'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <LanguageToggle />

        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="text-[#d2b48c] hover:text-white text-lg transition-colors"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="text-[#d2b48c] hover:text-white text-xl transition-colors"
          aria-label={t('owner_logout')}
          title={t('owner_logout')}
        >
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>
    </header>
  );
}
