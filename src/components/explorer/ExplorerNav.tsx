'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useT } from '@/i18n/useT';

const TABS = [
  { page: 'home', icon: 'home', labelKey: 'nav_home' },
  { page: 'map', icon: 'map-marked-alt', labelKey: 'nav_map' },
  { page: 'festival', icon: 'calendar-alt', labelKey: 'nav_festivals' },
  { page: 'wishlist', icon: 'heart', labelKey: 'nav_saved' },
  { page: 'profile', icon: 'user', labelKey: 'nav_you' },
] as const;

export default function ExplorerNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { wishlist } = useStore();
  const t = useT();

  const handleNav = (page: string) => {
    if (page === 'home') router.push('/explorer');
    if (page === 'map') router.push('/explorer/map');
    if (page === 'wishlist') router.push('/explorer/wishlist');
    if (page === 'profile') router.push('/explorer/you');
    if (page === 'festival') router.push('/festival');
  };

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 w-full md:hidden z-50 safe-area-bottom">
      <div className="mx-auto w-full max-w-md px-2 flex justify-around py-2">
        {TABS.map(({ page, icon, labelKey }) => {
          const label = t(labelKey);
          const isActive =
            (page === 'home' && pathname === '/explorer') ||
            (page === 'map' && pathname.startsWith('/explorer/map')) ||
            (page === 'wishlist' && pathname.startsWith('/explorer/wishlist')) ||
            (page === 'profile' && pathname.startsWith('/explorer/you')) ||
            (page === 'festival' && pathname.startsWith('/festival'));
          return (
            <button
              key={page}
              type="button"
              onClick={() => handleNav(page)}
              aria-label={label}
              className="flex flex-col items-center gap-1 relative px-4 py-1 rounded-xl transition-all"
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8d5524]" />
              )}

              {/* Icon container */}
              <div
                className={`relative w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-[#8d5524]/10' : ''
                }`}
              >
                <i
                  className={`fas fa-${icon} text-lg transition-all ${
                    isActive ? 'text-[#8d5524]' : 'text-gray-400'
                  }`}
                />

                {/* Wishlist badge */}
                {page === 'wishlist' && wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black animate-bounce-soft">
                    {wishlist.length}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-bold transition-all ${
                  isActive ? 'text-[#8d5524]' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
