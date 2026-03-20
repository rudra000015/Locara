'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type OwnerPage } from '@/store/useStore';
import { useT } from '@/i18n/useT';
import type { TranslationKey } from '@/i18n/translations';

const TABS: { key: OwnerPage; icon: string; labelKey: TranslationKey }[] = [
  { key: 'showcase', icon: 'th', labelKey: 'owner_showcase' },
  { key: 'profile', icon: 'id-card', labelKey: 'owner_profile' },
  { key: 'collections', icon: 'layer-group', labelKey: 'owner_collections' },
  { key: 'addproduct', icon: 'plus-circle', labelKey: 'owner_add' },
  { key: 'analytics', icon: 'chart-line', labelKey: 'owner_stats' },
];

export default function OwnerBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="bg-white border-t flex justify-around py-3 md:hidden flex-shrink-0">
      {TABS.map(({ key, icon, labelKey }) => (
        <button
          key={key}
          type="button"
          onClick={() => router.push(key === 'showcase' ? '/owner' : `/owner/${key}`)}
          className={`flex flex-col items-center transition-colors ${
            (key === 'showcase' ? pathname === '/owner' : pathname.startsWith(`/owner/${key}`))
              ? 'text-[#8d5524]'
              : 'text-gray-400'
          }`}
        >
          <i className={`fas fa-${icon} text-xl mb-1`} />
          <span className="text-[10px] font-bold">{t(labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
